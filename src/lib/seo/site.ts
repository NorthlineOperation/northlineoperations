export const SITE_NAME = "Northline Building Services";
export const LEGAL_NAME = "Northline Operation LLC";
export const ALT_NAME = "Northline Operation";

export const DEFAULT_TITLE =
  "Northline Building Services | Commercial Cleaning & Site Support in Columbus, OH";

export const DEFAULT_DESCRIPTION =
  "Northline Building Services provides post-construction cleaning, janitorial services, move-out turnovers, and site support for contractors, property managers, and commercial facilities in Columbus and Central Ohio.";

export const SEO_KEYWORDS = [
  "commercial cleaning Columbus Ohio",
  "post-construction cleaning",
  "construction cleanup",
  "janitorial services Columbus",
  "move-out cleaning",
  "commercial building services",
  "site support",
  "facility cleaning Central Ohio",
  "property cleaning services",
  "commercial janitorial",
];

/** Canonical site origin, no trailing slash. */
export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://northlineoperation.com";
  return raw.replace(/\/+$/, "");
}

/** "POST-CONSTRUCTION CLEANING" -> "Post-Construction Cleaning" */
export function titleCase(value: string) {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
