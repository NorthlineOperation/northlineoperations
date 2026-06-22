import { NextResponse } from "next/server";
import { z } from "zod";

import { getJobApplicationRecipient, sendEmail } from "@/lib/email/mailer";
import {
  getClientIp,
  rateLimit,
  tooManyRequestsResponse,
} from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const RATE_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 };

const applicationSchema = z.object({
  fullName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  position: z.string().trim().min(1),
  experience: z.string().trim().optional().default(""),
  availability: z.string().trim().optional().default(""),
  message: z.string().trim().optional().default(""),
});

type ApplicationPayload = z.infer<typeof applicationSchema>;

export async function POST(request: Request) {
  const limited = await rateLimit(`apply:${getClientIp(request)}`, RATE_LIMIT);
  if (!limited.success) {
    return tooManyRequestsResponse(limited);
  }

  try {
    const { payload, resume } = await readApplication(request);

    if (!resume) {
      return NextResponse.json(
        { error: "Please attach your résumé as a PDF." },
        { status: 400 },
      );
    }

    if (resume.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Your résumé must be a PDF file." },
        { status: 400 },
      );
    }

    if (resume.size > MAX_RESUME_SIZE) {
      return NextResponse.json(
        { error: "Résumé uploads must be 5MB or smaller." },
        { status: 400 },
      );
    }

    const resumeContent = Buffer.from(await resume.arrayBuffer());
    const resumeName = sanitizeFileName(resume.name) || "resume.pdf";

    await sendEmail({
      to: getJobApplicationRecipient(),
      replyTo: payload.email,
      subject: `New job application — ${payload.fullName} (${payload.position})`,
      html: buildApplicationEmail(payload),
      attachments: [
        {
          filename: resumeName,
          content: resumeContent,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Some required details are missing.", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit application.",
      },
      { status: 500 },
    );
  }
}

async function readApplication(request: Request): Promise<{
  payload: ApplicationPayload;
  resume: File | null;
}> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const rawPayload = formData.get("payload");
    const resume = formData.get("resume");

    if (typeof rawPayload !== "string") {
      throw new Error("Application details are required.");
    }

    return {
      payload: applicationSchema.parse(JSON.parse(rawPayload)),
      resume: resume instanceof File && resume.size > 0 ? resume : null,
    };
  }

  return {
    payload: applicationSchema.parse(await request.json()),
    resume: null,
  };
}

function buildApplicationEmail(payload: ApplicationPayload) {
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:6px 14px 6px 0;font-weight:bold;color:#555;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111">${escapeHtml(
          value,
        ).replace(/\n/g, "<br/>")}</td></tr>`
      : "";

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px">
      <h2 style="margin:0 0 4px">New Job Application</h2>
      <p style="margin:0 0 16px;color:#555">A candidate applied through the Northline website.</p>
      <table style="border-collapse:collapse;font-size:14px">
        ${row("Name", payload.fullName)}
        ${row("Email", payload.email)}
        ${row("Phone", payload.phone)}
        ${row("Position", payload.position)}
        ${row("Experience", payload.experience)}
        ${row("Availability", payload.availability)}
        ${row("Message", payload.message)}
      </table>
      <p style="margin:18px 0 0;color:#555">The candidate's résumé is attached as a PDF.</p>
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

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
