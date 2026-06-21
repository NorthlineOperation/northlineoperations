import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Keep-alive ping for the Supabase database.
 *
 * Supabase's free tier pauses a project after a stretch of inactivity. A small,
 * scheduled query (see the Vercel cron in vercel.json) keeps the database warm.
 *
 * When CRON_SECRET is set, Vercel sends it as `Authorization: Bearer <secret>`
 * on cron invocations, which we verify to keep the endpoint from being abused.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const authorization = request.headers.get("authorization");
    if (authorization !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("cms_landing_pages")
      .select("slug")
      .limit(1);

    return NextResponse.json({
      ok: true,
      database: error ? "reachable (query error)" : "ok",
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Keep-alive failed.",
      },
      { status: 500 },
    );
  }
}
