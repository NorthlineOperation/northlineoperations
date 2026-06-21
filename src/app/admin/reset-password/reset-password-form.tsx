"use client";

import { ArrowLeft, Loader2, LockKeyhole, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type RecoveryStatus = "checking" | "ready" | "invalid";

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Unable to reset the password right now.";
}

function getRecoveryErrorMessage(value: string) {
  if (value === "missing_code") {
    return "This reset link is missing a recovery code. Request a new password reset link.";
  }

  if (value === "recovery_failed") {
    return "This reset link could not be verified. Request a new password reset link.";
  }

  return value;
}

function cleanRecoveryUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  url.searchParams.delete("error");
  url.searchParams.delete("error_description");
  url.searchParams.delete("message");
  window.history.replaceState(window.history.state, "", url.toString());
}

export function AdminResetPasswordForm() {
  const router = useRouter();
  const [status, setStatus] = useState<RecoveryStatus>("checking");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function prepareRecoverySession() {
      try {
        const params = new URLSearchParams(window.location.search);
        const redirectError =
          params.get("message") ??
          params.get("error_description") ??
          params.get("error");

        if (redirectError) {
          throw new Error(getRecoveryErrorMessage(redirectError));
        }

        const supabase = createBrowserSupabaseClient();
        const userResult = await supabase.auth.getUser();
        let user = userResult.data.user;

        if (!user) {
          const code = params.get("code");

          if (code) {
            const { error: exchangeError } =
              await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
              throw exchangeError;
            }

            const exchangedUserResult = await supabase.auth.getUser();
            user = exchangedUserResult.data.user;
            cleanRecoveryUrl();
          }
        }

        if (!user) {
          throw new Error(
            "This reset link is invalid or has expired. Request a new password reset link.",
          );
        }

        if (isMounted) {
          setError(null);
          setStatus("ready");
        }
      } catch (recoveryError) {
        if (isMounted) {
          setError(getErrorMessage(recoveryError));
          setStatus("invalid");
        }
      }
    }

    prepareRecoverySession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsPending(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsPending(false);
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut();
      router.replace("/admin/login?reset=complete");
      router.refresh();
    } catch (resetError) {
      setError(getErrorMessage(resetError));
    } finally {
      setIsPending(false);
    }
  }

  const isReady = status === "ready";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {status === "checking" && (
        <Alert>
          <Loader2 className="animate-spin" />
          <AlertDescription>Checking your reset link...</AlertDescription>
        </Alert>
      )}

      {status === "invalid" && error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isReady && (
        <>
          <Alert>
            <LockKeyhole />
            <AlertDescription>
              Enter a new password for this admin account.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              aria-invalid={Boolean(error)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <Save data-icon="inline-start" />
            )}
            Update password
          </Button>
        </>
      )}

      <Button type="button" variant="ghost" asChild>
        <Link href="/admin/login">
          <ArrowLeft data-icon="inline-start" />
          Back to sign in
        </Link>
      </Button>
    </form>
  );
}
