import { LandingPageEditor } from "./landing-page-editor";

import { getLandingPageRecord } from "@/lib/cms/landing-page";
import { defaultLandingPageContent } from "@/lib/cms/landing-page-content";

export const dynamic = "force-dynamic";

export default async function AdminLandingPagePage() {
  const record = await getLandingPageRecord();

  return (
    <LandingPageEditor
      initialRecord={record}
      defaultContent={defaultLandingPageContent}
    />
  );
}
