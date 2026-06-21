"use client";

import { ArrowLeft, Loader2, MailCheck, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function getResetRedirectUrl() {
  const redirectUrl = new URL("/admin/auth/callback", window.location.origin);
  redirectUrl.searchParams.set("next", "/admin/reset-password");

  return redirectUrl.toString();
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Unable to send a password reset email right now.";
}

export function AdminForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSentTo(null);
    setIsPending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: getResetRedirectUrl(),
        },
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSentTo(email);
      form.reset();
    } catch (resetError) {
      setError(getErrorMessage(resetError));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Admin email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(error)}
        />
      </div>

      {sentTo && (
        <Alert>
          <MailCheck />
          <AlertTitle>Check your inbox</AlertTitle>
          <AlertDescription>
            If an admin account exists for {sentTo}, Supabase will send a reset
            link there shortly.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        ) : (
          <Send data-icon="inline-start" />
        )}
        Send reset link
      </Button>

      <Button type="button" variant="ghost" asChild>
        <Link href="/admin/login">
          <ArrowLeft data-icon="inline-start" />
          Back to sign in
        </Link>
      </Button>
    </form>
  );
}
