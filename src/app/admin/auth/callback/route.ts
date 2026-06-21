import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin/reset-password";
  }

  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));
  const redirectUrl = new URL(nextPath, requestUrl.origin);

  if (!code) {
    redirectUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      redirectUrl.searchParams.set("error", "recovery_failed");
      redirectUrl.searchParams.set("message", error.message);
    }
  } catch (error) {
    redirectUrl.searchParams.set("error", "recovery_failed");
    redirectUrl.searchParams.set(
      "message",
      error instanceof Error
        ? error.message
        : "Unable to verify this reset link.",
    );
  }

  return NextResponse.redirect(redirectUrl);
}
