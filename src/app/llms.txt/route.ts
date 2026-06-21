import { getLandingPageContent } from "@/lib/cms/landing-page";
import { getSiteUrl, LEGAL_NAME, SITE_NAME, titleCase } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

/**
 * /llms.txt — a concise, factual overview for LLMs and AI search engines.
 * Follows the emerging llms.txt convention (https://llmstxt.org).
 */
export async function GET() {
  const content = await getLandingPageContent();
  const siteUrl = getSiteUrl();
  const { hero, services, projects, footer } = content;

  const serviceLines = services
    .map((service) => `- ${titleCase(service.title)}: ${service.bullets.join(", ")}.`)
    .join("\n");

  const body = `# ${SITE_NAME}

> ${hero.summary}

${hero.description}

${SITE_NAME} (legal name: ${LEGAL_NAME}) is a commercial building services company based in ${footer.location}.

## Services

${serviceLines}

## Service Area

${titleCase(projects.serviceAreaLabel)}. Cities served include: ${projects.cities.join(", ")}.

## Contact

- Phone: ${footer.phone}
- Email: ${footer.email}
- Location: ${footer.location}
- Website: ${siteUrl}

## Request a Quote

Prospective clients can request a free, no-obligation quote at ${siteUrl}/#quote or by phone at ${footer.phone}.

## Careers

${SITE_NAME} accepts job applications through the "Join the Team" option on ${siteUrl}.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
