"use client";

import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const positions = [
  "Cleaning Technician",
  "Post-Construction Cleaner",
  "Janitorial Staff",
  "Move-Out / Turnover Crew",
  "Site Support",
  "Crew Lead / Supervisor",
  "Other",
];

const experienceOptions = [
  "Less than 1 year",
  "1 - 3 years",
  "3 - 5 years",
  "5+ years",
];

type ApplicationForm = {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  availability: string;
  message: string;
};

const initialForm: ApplicationForm = {
  fullName: "",
  email: "",
  phone: "",
  position: "",
  experience: "",
  availability: "",
  message: "",
};

export function JoinTeamDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<TField extends keyof ApplicationForm>(
    field: TField,
    value: string,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function reset() {
    setForm(initialForm);
    setResume(null);
    setError(null);
    setSubmitted(false);
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      window.setTimeout(reset, 200);
    }
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    setResume(event.target.files?.[0] ?? null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.fullName.trim()) return setError("Please enter your full name.");
    if (!form.email.trim()) return setError("Please enter your email address.");
    if (!form.phone.trim()) return setError("Please enter your phone number.");
    if (!form.position.trim()) return setError("Please select a position.");
    if (!resume) return setError("Please attach your résumé as a PDF.");
    if (resume.type !== "application/pdf") {
      return setError("Your résumé must be a PDF file.");
    }
    if (resume.size > MAX_RESUME_SIZE) {
      return setError("Résumé uploads must be 5MB or smaller.");
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(form));
      formData.append("resume", resume);

      const response = await fetch("/api/job-applications", {
        method: "POST",
        body: formData,
      });
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(body.error ?? "Unable to submit your application.");
      }

      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b px-6 py-5 pr-14 text-left">
          <div className="flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold">
              <Users className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-2xl">
                Join the Team
              </DialogTitle>
              <DialogDescription>
                Apply to work with Northline Building Services.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {submitted ? (
            <div className="rounded-lg border bg-secondary p-6 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-ink">
                <CheckCircle2 className="size-7" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold">
                Application received.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Thanks for your interest in joining Northline. Our team will
                review your application and reach out if it&apos;s a good fit.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button type="button" onClick={reset}>
                  Submit Another Application
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
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
                  required
                  value={form.phone}
                  placeholder="(614) 555-0199"
                  onChange={(value) => update("phone", value)}
                />
                <SelectField
                  label="Position"
                  required
                  value={form.position}
                  placeholder="Select a position"
                  options={positions}
                  onChange={(value) => update("position", value)}
                />
              </div>

              <div className="grid gap-x-4 gap-y-6 md:grid-cols-2">
                <SelectField
                  label="Years of Experience"
                  value={form.experience}
                  placeholder="Select experience"
                  options={experienceOptions}
                  onChange={(value) => update("experience", value)}
                />
                <Field
                  label="Earliest Start Date"
                  value={form.availability}
                  placeholder="e.g., Immediately, 2 weeks"
                  onChange={(value) => update("availability", value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="join-message">Why do you want to join?</Label>
                <Textarea
                  id="join-message"
                  rows={4}
                  value={form.message}
                  placeholder="Tell us a little about yourself and your experience."
                  onChange={(event) => update("message", event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="join-resume">
                  Résumé (PDF)
                  <span className="text-destructive"> *</span>
                </Label>
                <label
                  htmlFor="join-resume"
                  className="grid min-h-28 cursor-pointer place-items-center rounded-lg border border-dashed bg-secondary/40 p-5 text-center text-sm text-muted-foreground transition hover:border-gold"
                >
                  <Upload className="mb-2 size-6 text-gold" />
                  <span className="font-medium text-ink">
                    {resume ? resume.name : "Click to upload your résumé"}
                  </span>
                  <span>PDF only. Max 5MB.</span>
                  <Input
                    id="join-resume"
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={onFileChange}
                  />
                </label>
              </div>

              <div className="flex gap-3 rounded-lg border bg-secondary p-4 text-sm">
                <ShieldCheck className="size-5 shrink-0 text-gold" />
                <p className="text-muted-foreground">
                  Your information is sent directly to our hiring team and is
                  never shared.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold text-ink hover:bg-gold/90"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
  const id = `join-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

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

function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
