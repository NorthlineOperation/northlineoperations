import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  defaultLandingPageContent,
  landingPageContentSchema,
  safeParseLandingPageContent,
  type LandingPageContent,
} from "@/lib/cms/landing-page-content";

export const LANDING_PAGE_SLUG = "home";
export const LANDING_PAGE_TABLE = "cms_landing_pages";

type LandingPageRow = {
  slug: string;
  content: unknown;
  updated_at: string | null;
  updated_by: string | null;
};

export type LandingPageRecord = {
  slug: string;
  content: LandingPageContent;
  updatedAt: string | null;
  updatedBy: string | null;
  source: "database" | "fallback";
};

export async function getLandingPageRecord(): Promise<LandingPageRecord> {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from(LANDING_PAGE_TABLE)
      .select("slug, content, updated_at, updated_by")
      .eq("slug", LANDING_PAGE_SLUG)
      .maybeSingle<LandingPageRow>();

    if (error || !data) {
      return fallbackRecord();
    }

    return {
      slug: data.slug,
      content: safeParseLandingPageContent(data.content),
      updatedAt: data.updated_at,
      updatedBy: data.updated_by,
      source: "database",
    };
  } catch {
    return fallbackRecord();
  }
}

export async function getLandingPageContent() {
  const record = await getLandingPageRecord();
  return record.content;
}

export async function updateLandingPageContent({
  content,
  adminId,
}: {
  content: unknown;
  adminId: string;
}) {
  const parsedContent = landingPageContentSchema.parse(content);
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(LANDING_PAGE_TABLE)
    .upsert(
      {
        slug: LANDING_PAGE_SLUG,
        content: parsedContent,
        updated_by: adminId,
      },
      { onConflict: "slug" },
    )
    .select("slug, content, updated_at, updated_by")
    .single<LandingPageRow>();

  if (error) {
    throw new Error(formatCmsTableError(error.message));
  }

  return {
    slug: data.slug,
    content: safeParseLandingPageContent(data.content),
    updatedAt: data.updated_at,
    updatedBy: data.updated_by,
    source: "database" as const,
  };
}

function formatCmsTableError(message: string) {
  if (
    message.includes("schema cache") ||
    message.includes(LANDING_PAGE_TABLE)
  ) {
    return `CMS table is not ready. Run supabase/migrations/202606210001_create_cms_landing_pages.sql in Supabase, then try saving again.`;
  }

  return message;
}

function fallbackRecord(): LandingPageRecord {
  return {
    slug: LANDING_PAGE_SLUG,
    content: defaultLandingPageContent,
    updatedAt: null,
    updatedBy: null,
    source: "fallback",
  };
}
