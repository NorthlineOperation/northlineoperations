import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAdmin } from "@/lib/auth/admin";
import {
  getLandingPageRecord,
  updateLandingPageContent,
} from "@/lib/cms/landing-page";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await getLandingPageRecord();
  return NextResponse.json(record);
}

export async function PUT(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const record = await updateLandingPageContent({
      content: body.content,
      adminId: admin.id,
    });

    revalidatePath("/");
    revalidatePath("/admin/landing-page");

    return NextResponse.json(record);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid landing page content",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to save content",
      },
      { status: 500 },
    );
  }
}
