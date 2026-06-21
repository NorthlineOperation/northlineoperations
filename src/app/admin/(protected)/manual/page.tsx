import { promises as fs } from "node:fs";
import path from "node:path";

import { marked } from "marked";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Manual",
};

async function getManualHtml(): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "docs", "ADMIN_MANUAL.md");
    const markdown = await fs.readFile(filePath, "utf8");
    // Content is a trusted, in-repo document — safe to render as HTML.
    return await marked.parse(markdown, { gfm: true });
  } catch {
    return null;
  }
}

export default async function ManualPage() {
  const html = await getManualHtml();

  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Admin Manual
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A complete guide to managing the website through this CMS.
        </p>
      </div>

      {html ? (
        <article
          className="admin-doc mt-8 rounded-lg border bg-background p-6 sm:p-8"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <p className="mt-8 rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          The manual could not be loaded. It lives at{" "}
          <code>docs/ADMIN_MANUAL.md</code> in the project.
        </p>
      )}
    </div>
  );
}
