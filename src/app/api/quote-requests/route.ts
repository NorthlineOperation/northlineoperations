import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getQuoteStorageBucket } from "@/lib/supabase/env";
import { getQuoteRequestRecipient, sendEmail } from "@/lib/email/mailer";
import {
  getClientIp,
  rateLimit,
  tooManyRequestsResponse,
} from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

const MAX_FLOOR_PLAN_SIZE = 10 * 1024 * 1024;
const ALLOWED_FLOOR_PLAN_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const contactSchema = z.object({
  fullName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  companyName: z.string().trim().optional().default(""),
  jobTitle: z.string().trim().optional().default(""),
  referralSource: z.string().trim().optional().default(""),
});

const propertySchema = z.object({
  propertyName: z.string().trim().min(1),
  propertyType: z.string().trim().min(1),
  streetAddress: z.string().trim().min(1),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  zipCode: z.string().trim().min(1),
  buildingSize: z.string().trim().min(1),
  floors: z.string().trim().optional().default(""),
  onSiteContact: z.string().trim().optional().default(""),
  onSitePhone: z.string().trim().optional().default(""),
  bestContactTime: z.string().trim().optional().default(""),
  preferredStartDate: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),
});

const cleaningNeedsSchema = z.object({
  selectedServiceIds: z.array(z.string().trim().min(1)).min(1),
  frequency: z.string().trim().min(1),
  suppliesProvided: z.string().trim().min(1),
  urgency: z.string().trim().min(1),
  serviceNotes: z.string().trim().optional().default(""),
});

const additionalInfoSchema = z.object({
  accessStart: z.string().trim().optional().default(""),
  accessEnd: z.string().trim().optional().default(""),
  accessProvider: z.string().trim().optional().default(""),
  accessOther: z.string().trim().optional().default(""),
  elevatorAccess: z.string().trim().optional().default(""),
  loadingDock: z.string().trim().optional().default(""),
  restrooms: z.string().trim().optional().default(""),
  breakRooms: z.string().trim().optional().default(""),
  privateOffices: z.string().trim().optional().default(""),
  specialConsiderations: z.string().trim().optional().default(""),
  afterHours: z.string().trim().optional().default(""),
  weekendService: z.string().trim().optional().default(""),
});

const quoteRequestSchema = z.object({
  contact: contactSchema,
  property: propertySchema,
  cleaningNeeds: cleaningNeedsSchema,
  additionalInfo: additionalInfoSchema,
  estimate: z.object({
    min: z.number().int().nonnegative(),
    max: z.number().int().nonnegative(),
  }),
});

type QuoteRequestPayload = z.infer<typeof quoteRequestSchema>;

type QuoteRequestRow = {
  id: string;
  submitted_at: string;
};

export async function POST(request: Request) {
  const limited = rateLimit(`quote:${getClientIp(request)}`, RATE_LIMIT);
  if (!limited.success) {
    return tooManyRequestsResponse(limited);
  }

  try {
    const { payload, floorPlan } = await readQuoteRequest(request);
    const requestId = crypto.randomUUID();
    const floorPlanPath = floorPlan
      ? await uploadFloorPlan(requestId, floorPlan)
      : null;

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("quote_requests")
      .insert({
        id: requestId,
        contact: payload.contact,
        property: payload.property,
        cleaning_needs: payload.cleaningNeeds,
        additional_info: payload.additionalInfo,
        selected_services: payload.cleaningNeeds.selectedServiceIds,
        floor_plan_path: floorPlanPath,
        estimated_min: payload.estimate.min,
        estimated_max: payload.estimate.max,
      })
      .select("id, submitted_at")
      .single<QuoteRequestRow>();

    if (error) {
      throw new Error(error.message);
    }

    await notifyAdminOfQuoteRequest(data.id, payload, floorPlan);

    return NextResponse.json(
      {
        ok: true,
        id: data.id,
        submittedAt: data.submitted_at,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid quote request",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit quote request",
      },
      { status: 500 },
    );
  }
}

async function readQuoteRequest(request: Request): Promise<{
  payload: QuoteRequestPayload;
  floorPlan: File | null;
}> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const rawPayload = formData.get("payload");
    const floorPlan = formData.get("floorPlan");

    if (typeof rawPayload !== "string") {
      throw new Error("Quote request payload is required.");
    }

    return {
      payload: quoteRequestSchema.parse(JSON.parse(rawPayload)),
      floorPlan:
        floorPlan instanceof File && floorPlan.size > 0 ? floorPlan : null,
    };
  }

  return {
    payload: quoteRequestSchema.parse(await request.json()),
    floorPlan: null,
  };
}

async function uploadFloorPlan(requestId: string, file: File) {
  if (!ALLOWED_FLOOR_PLAN_TYPES.has(file.type)) {
    throw new Error("Floor plan must be a PDF, JPG, PNG, or WEBP file.");
  }

  if (file.size > MAX_FLOOR_PLAN_SIZE) {
    throw new Error("Floor plan uploads must be 10MB or smaller.");
  }

  const supabase = createSupabaseAdminClient();
  const bucket = getQuoteStorageBucket();
  const path = `${requestId}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

function sanitizeFileName(fileName: string) {
  const sanitized = fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "floor-plan";
}

async function notifyAdminOfQuoteRequest(
  requestId: string,
  payload: QuoteRequestPayload,
  floorPlan: File | null,
) {
  try {
    const attachments = floorPlan
      ? [
          {
            filename: sanitizeFileName(floorPlan.name),
            content: Buffer.from(await floorPlan.arrayBuffer()),
            contentType: floorPlan.type || undefined,
          },
        ]
      : undefined;

    await sendEmail({
      to: getQuoteRequestRecipient(),
      replyTo: payload.contact.email,
      subject: `New quote request — ${payload.contact.fullName} (${payload.property.propertyName})`,
      html: buildQuoteEmail(requestId, payload),
      attachments,
    });
  } catch (emailError) {
    // The quote is already saved; don't fail the request if email delivery fails.
    console.error("Failed to send quote request email:", emailError);
  }
}

function buildQuoteEmail(requestId: string, payload: QuoteRequestPayload) {
  const { contact, property, cleaningNeeds, additionalInfo, estimate } =
    payload;

  const section = (title: string, rows: Array<[string, string]>) => {
    const body = rows
      .filter(([, value]) => value && value.trim())
      .map(
        ([label, value]) =>
          `<tr><td style="padding:5px 14px 5px 0;font-weight:bold;color:#555;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:5px 0;color:#111">${escapeHtml(
            value,
          ).replace(/\n/g, "<br/>")}</td></tr>`,
      )
      .join("");

    if (!body) return "";

    return `<h3 style="margin:20px 0 6px;font-size:15px;color:#111">${title}</h3><table style="border-collapse:collapse;font-size:14px">${body}</table>`;
  };

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:620px">
      <h2 style="margin:0 0 4px">New Quote Request</h2>
      <p style="margin:0 0 4px;color:#555">Reference ID: ${escapeHtml(requestId)}</p>
      ${section("Contact", [
        ["Name", contact.fullName],
        ["Email", contact.email],
        ["Phone", contact.phone],
        ["Company", contact.companyName],
        ["Job Title", contact.jobTitle],
        ["Referral", contact.referralSource],
      ])}
      ${section("Property", [
        ["Property Name", property.propertyName],
        ["Property Type", property.propertyType],
        [
          "Address",
          [
            property.streetAddress,
            `${property.city}, ${property.state} ${property.zipCode}`.trim(),
          ]
            .filter(Boolean)
            .join("\n"),
        ],
        ["Building Size", property.buildingSize],
        ["Floors", property.floors],
        ["On-Site Contact", property.onSiteContact],
        ["On-Site Phone", property.onSitePhone],
        ["Best Contact Time", property.bestContactTime],
        ["Preferred Start", property.preferredStartDate],
        ["Notes", property.notes],
      ])}
      ${section("Cleaning Needs", [
        ["Services", cleaningNeeds.selectedServiceIds.join(", ")],
        ["Frequency", cleaningNeeds.frequency],
        ["Supplies", cleaningNeeds.suppliesProvided],
        ["Timeline", cleaningNeeds.urgency],
        ["Instructions", cleaningNeeds.serviceNotes],
      ])}
      ${section("Additional Info", [
        [
          "Building Access",
          [additionalInfo.accessStart, additionalInfo.accessEnd]
            .filter(Boolean)
            .join(" - "),
        ],
        ["Access Provided By", additionalInfo.accessProvider],
        ["Elevator Access", additionalInfo.elevatorAccess],
        ["Loading Dock", additionalInfo.loadingDock],
        ["Restrooms", additionalInfo.restrooms],
        ["Break Rooms", additionalInfo.breakRooms],
        ["Private Offices", additionalInfo.privateOffices],
        ["Special Considerations", additionalInfo.specialConsiderations],
        ["After-Hours", additionalInfo.afterHours],
        ["Weekend Service", additionalInfo.weekendService],
      ])}
      ${section("Planning Estimate", [
        [
          "Range",
          `$${estimate.min.toLocaleString()} - $${estimate.max.toLocaleString()}`,
        ],
      ])}
      <p style="margin:18px 0 0;color:#555">Any uploaded floor plan is attached to this email.</p>
    </div>`;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] ?? char,
  );
}
