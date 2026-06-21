import { NextResponse } from "next/server";
import { z } from "zod";

import { getContactRecipient, sendEmail } from "@/lib/email/mailer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const contactSchema = z.object({
  fullName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().default(""),
  reason: z.string().trim().optional().default(""),
  message: z.string().trim().min(1),
});

type ContactPayload = z.infer<typeof contactSchema>;

export async function POST(request: Request) {
  try {
    const payload = contactSchema.parse(await request.json());

    await sendEmail({
      to: getContactRecipient(),
      replyTo: payload.email,
      subject: `New contact message — ${payload.fullName}${
        payload.reason ? ` (${payload.reason})` : ""
      }`,
      html: buildContactEmail(payload),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please fill in the required fields.", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send your message.",
      },
      { status: 500 },
    );
  }
}

function buildContactEmail(payload: ContactPayload) {
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:6px 14px 6px 0;font-weight:bold;color:#555;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111">${escapeHtml(
          value,
        ).replace(/\n/g, "<br/>")}</td></tr>`
      : "";

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px">
      <h2 style="margin:0 0 4px">New Contact Message</h2>
      <p style="margin:0 0 16px;color:#555">Someone reached out through the Northline website.</p>
      <table style="border-collapse:collapse;font-size:14px">
        ${row("Name", payload.fullName)}
        ${row("Email", payload.email)}
        ${row("Phone", payload.phone)}
        ${row("Reason", payload.reason)}
        ${row("Message", payload.message)}
      </table>
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
