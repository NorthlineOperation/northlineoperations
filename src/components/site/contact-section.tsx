"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const reasons = [
  "General Inquiry",
  "Service Question",
  "Request a Walkthrough",
  "Partnership / Vendor",
  "Feedback",
  "Other",
];

type ContactForm = {
  fullName: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
};

const initialForm: ContactForm = {
  fullName: "",
  email: "",
  phone: "",
  reason: "",
  message: "",
};

export function ContactSection() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  function update<TField extends keyof ContactForm>(
    field: TField,
    value: string,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.fullName.trim()) return setError("Please enter your name.");
    if (!form.email.trim()) return setError("Please enter your email address.");
    if (!form.message.trim()) return setError("Please enter a message.");

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to send your message.");
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send your message.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 bg-secondary py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-bold tracking-[0.25em] text-gold">
            CONTACT US
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Have a question or want to discuss your facility&apos;s needs? Send
            us a message and our team will get back to you within one business
            day.
          </p>
        </div>

        <div className="max-w-2xl">
          <div className="rounded-lg border bg-white p-6 shadow-sm sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="grid size-14 place-items-center rounded-full bg-gold text-ink">
                  <CheckCircle2 className="size-7" />
                </div>
                <h3 className="font-display text-2xl font-bold">
                  Message sent.
                </h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  Thanks for reaching out. Our team will review your message and
                  get back to you shortly.
                </p>
                <Button type="button" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : !isExpanded ? (
              <div className="flex flex-col items-start gap-4 py-2">
                <div className="grid size-12 place-items-center rounded-lg bg-gold/15 text-gold">
                  <MessageSquare className="size-6" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">
                    Send us a message
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fill out a quick form and our team will get back to you
                    within one business day.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="bg-gold text-ink hover:bg-gold/90"
                >
                  Send us a Message
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-xl font-bold">
                    Send us a message
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition hover:border-gold/50 hover:text-ink"
                  >
                    <ChevronUp className="size-4" />
                    Collapse
                  </button>
                </div>

                {error ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    {error}
                  </div>
                ) : null}

                <div className="grid gap-x-4 gap-y-6 md:grid-cols-2">
                  <Field
                    label="Full Name"
                    required
                    value={form.fullName}
                    placeholder="John Doe"
                    onChange={(value) => update("fullName", value)}
                  />
                  <Field
                    label="Email Address"
                    type="email"
                    required
                    value={form.email}
                    placeholder="john.doe@email.com"
                    onChange={(value) => update("email", value)}
                  />
                </div>

                <div className="grid gap-x-4 gap-y-6 md:grid-cols-2">
                  <Field
                    label="Phone Number"
                    type="tel"
                    value={form.phone}
                    placeholder="(614) 555-0199"
                    onChange={(value) => update("phone", value)}
                  />
                  <div className="flex flex-col gap-2">
                    <Label>How can we help?</Label>
                    <Select
                      value={form.reason}
                      onValueChange={(value) => update("reason", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {reasons.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-message">
                    Message
                    <span className="text-destructive"> *</span>
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    placeholder="Tell us how we can help."
                    onChange={(event) => update("message", event.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-start bg-gold text-ink hover:bg-gold/90"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const id = `contact-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
