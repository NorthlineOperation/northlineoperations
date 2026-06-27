import { requireAdmin } from "@/lib/auth/admin";
import { getLandingPageContent } from "@/lib/cms/landing-page";

import { LandingPagePreview } from "./preview-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Standalone, admin-only route used inside the CMS editor's preview iframe.
// It lives outside the (protected) route group so it renders the public site
// without the admin chrome, while still requiring an authenticated admin.
export default async function LandingPagePreviewPage() {
  await requireAdmin();

  const content = await getLandingPageContent();

  return <LandingPagePreview initialContent={content} />;
}
