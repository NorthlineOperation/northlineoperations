import nodemailer, { type Transporter } from "nodemailer";

type Attachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

type SendEmailInput = {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachment[];
};

let cachedTransporter: Transporter | null = null;

function readRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Email is not configured. Set ${name}.`);
  }

  return value;
}

function getTransporter(): Transporter {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = readRequiredEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = readRequiredEnv("SMTP_USER");
  const pass = readRequiredEnv("SMTP_PASS");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return cachedTransporter;
}

/** Default "from" address for outbound mail. */
export function getDefaultSender() {
  return (
    process.env.SMTP_FROM ??
    process.env.SMTP_USER ??
    "no-reply@northlineoperation.com"
  );
}

/** Admin recipient for job applications. */
export function getJobApplicationRecipient() {
  return (
    process.env.JOB_APPLICATION_EMAIL_TO ??
    process.env.ADMIN_EMAIL ??
    "admin@northlineoperation.com"
  );
}

/** Admin recipient for quote requests. */
export function getQuoteRequestRecipient() {
  return (
    process.env.QUOTE_REQUEST_EMAIL_TO ??
    process.env.ADMIN_EMAIL ??
    "admin@northlineoperation.com"
  );
}

/** Admin recipient for general contact messages. */
export function getContactRecipient() {
  return (
    process.env.CONTACT_EMAIL_TO ??
    process.env.ADMIN_EMAIL ??
    "admin@northlineoperation.com"
  );
}

/** Send a transactional email through the configured SMTP server. */
export async function sendEmail(input: SendEmailInput) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: input.from ?? getDefaultSender(),
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    html: input.html,
    attachments: input.attachments,
  });
}
