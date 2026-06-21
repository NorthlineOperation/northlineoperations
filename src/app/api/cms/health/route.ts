import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/auth/admin";
import { getSupabaseStorageBucket } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    service: "northline-cms",
    storageBucket: getSupabaseStorageBucket(),
    user: {
      id: admin.id,
      email: admin.email,
    },
  });
}
