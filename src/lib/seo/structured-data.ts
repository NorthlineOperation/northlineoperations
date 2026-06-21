import type { LandingPageContent } from "@/lib/cms/landing-page-content";

import { ALT_NAME, getSiteUrl, LEGAL_NAME, SITE_NAME, titleCase } from "./site";

/**
 * Builds a schema.org JSON-LD graph (LocalBusiness + WebSite + service catalog)
 * from the live CMS content. Used for Google rich results and to give LLMs a
 * clean, factual description of the business.
 */
export function buildStructuredData(content: LandingPageContent) {
  const siteUrl = getSiteUrl();
  const { footer, services, projects, hero } = content;

  const sameAs = [
    footer.socialLinks.facebook,
    footer.socialLinks.linkedin,
    footer.socialLinks.instagram,
  ].filter((href) => href && href !== "#" && /^https?:\/\//.test(href));

  const businessId = `${siteUrl}/#business`;

  const business = {
    "@type": ["ProfessionalService", "CleaningService"],
    "@id": businessId,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    alternateName: ALT_NAME,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    logo: `${siteUrl}/opengraph-image`,
    description: hero.description,
    telephone: footer.phone,
    email: footer.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Columbus",
      addressRegion: "OH",
      addressCountry: "US",
    },
    areaServed: [
      ...projects.cities.map((city) => ({ "@type": "City", name: city })),
      { "@type": "AdministrativeArea", name: "Central Ohio" },
    ],
    knowsAbout: services.map((service) => titleCase(service.title)),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: footer.phone,
      email: footer.email,
      contactType: "customer service",
      areaServed: "US-OH",
      availableLanguage: "English",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Commercial Building Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: titleCase(service.title),
          description: service.bullets.join(", "),
          provider: { "@id": businessId },
          areaServed: "Central Ohio",
        },
      })),
    },
    ...(sameAs.length ? { sameAs } : {}),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: SITE_NAME,
    description: hero.summary,
    publisher: { "@id": businessId },
    inLanguage: "en-US",
  };

  const graph: object[] = [business, website];

  if (content.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: content.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
