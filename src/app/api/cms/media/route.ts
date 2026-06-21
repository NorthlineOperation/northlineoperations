import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/auth/admin";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseStorageBucket } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MEDIA_FOLDER = "landing-page";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export type CmsMediaAsset = {
  name: string;
  path: string;
  url: string;
  size: number | null;
  contentType: string | null;
  updatedAt: string | null;
};

export async function GET() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const bucket = getSupabaseStorageBucket();
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(MEDIA_FOLDER, {
      limit: 100,
      sortBy: { column: "updated_at", order: "desc" },
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const assets: CmsMediaAsset[] = (data ?? [])
    .filter((file) => file.name && file.id)
    .map((file) => toMediaAsset(file.name, file));

  return NextResponse.json({ assets });
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Image file is required" },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image uploads are supported" },
      { status: 400 },
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { error: "Image uploads must be 10MB or smaller" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const bucket = getSupabaseStorageBucket();
  const path = `${MEDIA_FOLDER}/${Date.now()}-${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const asset: CmsMediaAsset = {
    name: file.name,
    path,
    url: getPublicUrl(path),
    size: file.size,
    contentType: file.type,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ asset }, { status: 201 });
}

export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = new URL(request.url).searchParams.get("path");

  if (!path || !path.startsWith(`${MEDIA_FOLDER}/`) || path.includes("..")) {
    return NextResponse.json({ error: "Invalid media path" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const bucket = getSupabaseStorageBucket();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function toMediaAsset(
  name: string,
  file: {
    updated_at?: string | null;
    created_at?: string | null;
    metadata?: {
      size?: number;
      mimetype?: string;
      contentType?: string;
    } | null;
  },
): CmsMediaAsset {
  const path = `${MEDIA_FOLDER}/${name}`;

  return {
    name,
    path,
    url: getPublicUrl(path),
    size: file.metadata?.size ?? null,
    contentType: file.metadata?.mimetype ?? file.metadata?.contentType ?? null,
    updatedAt: file.updated_at ?? file.created_at ?? null,
  };
}

function getPublicUrl(path: string) {
  const supabase = createSupabaseAdminClient();
  const bucket = getSupabaseStorageBucket();

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function sanitizeFileName(fileName: string) {
  const sanitized = fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "image";
}
