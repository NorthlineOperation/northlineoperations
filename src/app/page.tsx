import type { Metadata } from "next";
import { cache } from "react";

import { LandingPage } from "@/components/site/landing-page";
import { getLandingPageContent } from "@/lib/cms/landing-page";
import { getGoogleReviews } from "@/lib/reviews/google";
import { buildStructuredData } from "@/lib/seo/structured-data";
import { getSiteUrl, SITE_NAME } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

// Dedupe the content fetch across generateMetadata + the page render (same request).
const getContent = cache(getLandingPageContent);

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const siteUrl = getSiteUrl();
  const title = `${SITE_NAME} | Commercial Cleaning & Site Support in Columbus, OH`;
  const description = content.hero.description;

  return {
    title,
    description,
    alternates: { canonical: siteUrl },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page() {
  const content = await getContent();
  const reviews = await getGoogleReviews(content.integrations.googlePlaceId);
  const structuredData = buildStructuredData(content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPage content={content} reviews={reviews} />
    </>
  );
}
