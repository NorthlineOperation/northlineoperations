import { z } from "zod";

const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const cmsImageAssetSchema = z
  .object({
    url: z.string().trim().default(""),
    alt: z.string().trim().default(""),
    path: z.string().trim().default(""),
  })
  .default({ url: "", alt: "", path: "" });

const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const defaultFaqItems = [
  {
    question: "What areas does Northline Building Services serve?",
    answer:
      "We serve Columbus, Ohio and the surrounding Central Ohio communities, including Dublin, Hilliard, Westerville, Grove City, New Albany, Reynoldsburg, and Pickerington.",
  },
  {
    question: "What types of cleaning services do you offer?",
    answer:
      "We provide post-construction cleaning, janitorial services, move-out and turnover cleaning, commercial cleaning, and general site support for contractors, property managers, and commercial facilities.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. Northline is fully insured with general liability coverage, and our team follows safety-first practices on every job for your peace of mind.",
  },
  {
    question: "How do I request a quote?",
    answer:
      "You can request a free, no-obligation quote using the 'Request a Quote' form on our website, or by calling our team directly. We typically respond within one business day.",
  },
  {
    question: "How soon can you start?",
    answer:
      "Scheduling depends on the scope of work, but we pride ourselves on quick, reliable turnaround. Most clients hear back from us within 24 hours, and we work to accommodate your timeline.",
  },
  {
    question: "Do you offer recurring janitorial contracts?",
    answer:
      "Yes. We offer flexible recurring schedules — daily, weekly, bi-weekly, or monthly — to keep your facility clean, healthy, and professional every day.",
  },
  {
    question: "Do you provide cleaning supplies and equipment?",
    answer:
      "We can provide all supplies and equipment, or work with materials you prefer. We'll confirm the details with you when we build your custom quote.",
  },
  {
    question: "Can you work after hours or on weekends?",
    answer:
      "Yes. We offer after-hours and weekend service so cleaning never disrupts your operations, tenants, or project schedule.",
  },
];

const serviceSchema = z.object({
  imageKey: z.enum(["post", "janitor", "moveout", "site"]),
  image: cmsImageAssetSchema,
  iconKey: z.enum(["sparkles", "sprayCan", "home", "trafficCone"]),
  title: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
});

const defaultProjectItems = [
  {
    id: "commercial-turnover",
    title: "Commercial Turnover",
    category: "Commercial Construction",
    location: "Columbus, Ohio",
    summary:
      "Final cleaning and turnover support for a commercial construction project.",
    beforeImage: {
      url: "",
      alt: "Commercial turnover before service",
      path: "",
    },
    afterImage: {
      url: "",
      alt: "Commercial turnover after service",
      path: "",
    },
  },
  {
    id: "office-facility",
    title: "Office Facility Refresh",
    category: "Office Facilities",
    location: "Dublin, Ohio",
    summary:
      "Detailed janitorial and presentation cleaning for an active office facility.",
    beforeImage: {
      url: "",
      alt: "Office facility before service",
      path: "",
    },
    afterImage: {
      url: "",
      alt: "Office facility after service",
      path: "",
    },
  },
  {
    id: "apartment-turnover",
    title: "Apartment Turnover",
    category: "Apartment Communities",
    location: "Westerville, Ohio",
    summary:
      "Move-out cleaning and readiness support for a managed apartment unit.",
    beforeImage: {
      url: "",
      alt: "Apartment turnover before service",
      path: "",
    },
    afterImage: {
      url: "",
      alt: "Apartment turnover after service",
      path: "",
    },
  },
  {
    id: "site-support",
    title: "Jobsite Support",
    category: "Site Support",
    location: "Central Ohio",
    summary:
      "Jobsite cleanup and organization support to keep the work area moving.",
    beforeImage: {
      url: "",
      alt: "Jobsite support before service",
      path: "",
    },
    afterImage: {
      url: "",
      alt: "Jobsite support after service",
      path: "",
    },
  },
];

const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  location: z.string().min(1),
  summary: z.string().min(1),
  beforeImage: cmsImageAssetSchema,
  afterImage: cmsImageAssetSchema,
});

export const landingPageContentSchema = z.object({
  hero: z.object({
    titleLine1: z.string().min(1),
    titleLine2: z.string().min(1),
    summary: z.string().min(1),
    description: z.string().min(1),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
    pills: z.array(z.string().min(1)).min(1),
    image: cmsImageAssetSchema,
  }),
  valueProps: z.array(
    z.object({
      iconKey: z.enum([
        "shield",
        "hardHat",
        "clock",
        "building",
        "shieldCheck",
      ]),
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  ),
  about: z.object({
    eyebrow: z.string().min(1),
    headingLine1: z.string().min(1),
    headingLine2: z.string().min(1),
    intro: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
    emphasis: z.string().min(1),
    cta: ctaSchema,
    imageBadge: z.string().min(1),
    image: cmsImageAssetSchema,
  }),
  servicesIntro: z.object({
    eyebrow: z.string().min(1),
    headingPrefix: z.string().min(1),
    headingHighlight: z.string().min(1),
    description: z.string().min(1),
  }),
  services: z.array(serviceSchema).min(1),
  whyChoose: z.object({
    eyebrow: z.string().min(1),
    headingLine1: z.string().min(1),
    headingLine2: z.string().min(1),
    description: z.string().min(1),
    cta: ctaSchema,
    items: z.array(
      z.object({
        iconKey: z.enum([
          "message",
          "building",
          "shield",
          "search",
          "user",
          "award",
        ]),
        label: z.string().min(1),
      }),
    ),
  }),
  mission: z.object({
    headingLine1: z.string().min(1),
    headingLine2: z.string().min(1),
    description: z.string().min(1),
    quoteLead: z.string().min(1),
    quoteEmphasis: z.string().min(1),
    focusLabelLine1: z.string().min(1),
    focusLabelLine2: z.string().min(1),
    focusText: z.string().min(1),
  }),
  projects: z.object({
    headingPrefix: z.string().min(1),
    headingHighlight: z.string().min(1),
    description: z.string().min(1),
    cta: ctaSchema,
    projectTypes: z.array(z.string().min(1)).min(1),
    serviceAreaLabel: z.string().min(1),
    cities: z.array(z.string().min(1)).min(1),
    items: z.array(projectSchema).min(4).default(defaultProjectItems),
  }),
  quote: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    cta: ctaSchema,
  }),
  footer: z.object({
    description: z.string().min(1),
    quickLinksTitle: z.string().min(1),
    servicesTitle: z.string().min(1),
    contactTitle: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
    location: z.string().min(1),
    website: z.string().min(1),
    copyright: z.string().min(1),
    socialLinks: z.object({
      facebook: z.string(),
      linkedin: z.string(),
      instagram: z.string(),
    }),
  }),
  faq: z.array(faqItemSchema).default(defaultFaqItems),
  integrations: z
    .object({
      googlePlaceId: z.string().trim().default(""),
    })
    .default({ googlePlaceId: "" }),
});

export type LandingPageContent = z.infer<typeof landingPageContentSchema>;
export type CmsImageAsset = z.infer<typeof cmsImageAssetSchema>;

export const KOT_DEVELOPER_URL = "https://kwabenaoseitutu.vercel.app";

const previousCopyrightText =
  "Copyright 2026 Northline Operation LLC. All rights reserved.";

export const northlineCopyrightText =
  "Copyright 2026 Northline Operation LLC. Developed by KOT. All rights reserved.";

export const defaultLandingPageContent: LandingPageContent = {
  hero: {
    titleLine1: "BUILT ON",
    titleLine2: "RELIABILITY.",
    summary:
      "Commercial building services that keep projects moving and properties operating at their best.",
    description:
      "Northline Building Services provides post-construction cleaning, janitorial services, move-out turnovers, and site support for contractors, property managers, and commercial facilities throughout Columbus, Ohio.",
    primaryCta: { label: "GET A QUOTE", href: "#quote" },
    secondaryCta: { label: "OUR SERVICES", href: "#services" },
    pills: ["Licensed & Insured", "Commercial-Focused", "Safety-First"],
    image: {
      url: "",
      alt: "Commercial building lobby",
      path: "",
    },
  },
  valueProps: [
    {
      iconKey: "shield",
      title: "RELIABLE",
      description: "We do what we say. Every time.",
    },
    {
      iconKey: "hardHat",
      title: "PROFESSIONAL",
      description: "Trained teams. Proven processes. Consistent results.",
    },
    {
      iconKey: "clock",
      title: "ON TIME",
      description: "We understand schedules and project deadlines.",
    },
    {
      iconKey: "building",
      title: "COMMERCIAL FOCUSED",
      description:
        "Built for contractors, facilities, and commercial properties.",
    },
    {
      iconKey: "shieldCheck",
      title: "SAFETY FIRST",
      description: "Safety is built into everything we do.",
    },
  ],
  about: {
    eyebrow: "ABOUT NORTHLINE OPERATION",
    headingLine1: "BUILT FOR PROJECTS.",
    headingLine2: "FOCUSED ON PEOPLE.",
    intro: "Northline Building Services is a division of Northline Operation.",
    paragraphs: [
      "We help contractors, property managers, and commercial facilities maintain clean, safe, and professional environments through reliable operational support services.",
      "From post-construction cleanup to recurring janitorial services, our mission is simple:",
    ],
    emphasis:
      "Deliver dependable service, clear communication, and exceptional results.",
    cta: { label: "LEARN MORE", href: "#services" },
    imageBadge: "On-site, on schedule",
    image: {
      url: "",
      alt: "Northline service van",
      path: "",
    },
  },
  servicesIntro: {
    eyebrow: "OUR SERVICES",
    headingPrefix: "CLEAN SPACES.",
    headingHighlight: "STRONG IMPRESSIONS.",
    description:
      "From construction turnover to ongoing facility support, we provide the services businesses depend on every day.",
  },
  services: [
    {
      imageKey: "post",
      image: {
        url: "",
        alt: "Post-construction cleaning service",
        path: "",
      },
      iconKey: "sparkles",
      title: "POST-CONSTRUCTION CLEANING",
      bullets: [
        "Rough cleaning",
        "Final cleaning",
        "Touch-up cleaning",
        "Dust removal",
        "Surface detailing",
      ],
    },
    {
      imageKey: "janitor",
      image: {
        url: "",
        alt: "Janitorial service",
        path: "",
      },
      iconKey: "sprayCan",
      title: "JANITORIAL SERVICES",
      bullets: [
        "Restroom sanitation",
        "Trash removal",
        "Floor care",
        "Surface cleaning",
        "Routine maintenance cleaning",
      ],
    },
    {
      imageKey: "moveout",
      image: {
        url: "",
        alt: "Move-out cleaning service",
        path: "",
      },
      iconKey: "home",
      title: "MOVE-OUT CLEANING",
      bullets: [
        "Apartment turnovers",
        "Commercial unit turnovers",
        "Property preparation",
        "Deep cleaning",
      ],
    },
    {
      imageKey: "site",
      image: {
        url: "",
        alt: "Site support service",
        path: "",
      },
      iconKey: "trafficCone",
      title: "SITE SUPPORT",
      bullets: [
        "Site cleanup",
        "Debris removal",
        "Material organization",
        "Jobsite support",
      ],
    },
  ],
  whyChoose: {
    eyebrow: "WHY CHOOSE NORTHLINE",
    headingLine1: "A PARTNER YOU",
    headingLine2: "CAN COUNT ON.",
    description:
      "We're more than a service provider. We're a project partner committed to helping our clients maintain safe, clean, and efficient environments.",
    cta: { label: "GET IN TOUCH", href: "#contact" },
    items: [
      { iconKey: "message", label: "Reliable Communication" },
      { iconKey: "building", label: "Commercial-Focused Expertise" },
      { iconKey: "shield", label: "Safety-First Mindset" },
      { iconKey: "search", label: "Detail-Driven Execution" },
      { iconKey: "user", label: "Professional Presentation" },
      { iconKey: "award", label: "Commitment to Quality" },
    ],
  },
  mission: {
    headingLine1: "OUR",
    headingLine2: "MISSION",
    description:
      "Northline Operation delivers reliable operational support services that help projects, properties, and businesses perform at a higher level.",
    quoteLead: "Our mission is more than a statement.",
    quoteEmphasis: "It's the standard we build on every day.",
    focusLabelLine1: "OUR",
    focusLabelLine2: "FOCUS",
    focusText:
      "To support our clients with dependable service, efficient execution, and a commitment to excellence in everything we do.",
  },
  projects: {
    headingPrefix: "PROJECTS WE'RE",
    headingHighlight: "PROUD OF",
    description:
      "Northline Building Services works with contractors, property managers, and commercial facilities throughout Central Ohio. Our team supports projects of all sizes with professional service and consistent execution.",
    cta: { label: "VIEW ALL PROJECTS", href: "#projects" },
    projectTypes: [
      "Commercial Construction",
      "Office Facilities",
      "Apartment Communities",
      "Property Turnovers",
      "Retail Spaces",
      "Medical Facilities",
    ],
    serviceAreaLabel: "SERVING COLUMBUS AND SURROUNDING COMMUNITIES",
    cities: [
      "Columbus",
      "Dublin",
      "Hilliard",
      "Westerville",
      "Grove City",
      "New Albany",
      "Reynoldsburg",
      "Pickerington",
    ],
    items: defaultProjectItems,
  },
  quote: {
    title: "READY TO GET STARTED?",
    description:
      "Whether you need post-construction cleaning, janitorial services, move-out turnovers, or site support, Northline Building Services is ready to help.",
    cta: { label: "REQUEST A QUOTE", href: "#contact" },
  },
  footer: {
    description:
      "Northline Building Services provides reliable operational support services for contractors, property managers, and commercial facilities.",
    quickLinksTitle: "QUICK LINKS",
    servicesTitle: "SERVICES",
    contactTitle: "CONTACT",
    email: "admin@northlineoperation.com",
    phone: "(614) 555-0199",
    location: "Columbus, Ohio",
    website: "northlineoperation.com",
    copyright: northlineCopyrightText,
    socialLinks: {
      facebook: "#",
      linkedin: "#",
      instagram: "#",
    },
  },
  faq: defaultFaqItems,
  integrations: { googlePlaceId: "" },
};

export function parseLandingPageContent(value: unknown): LandingPageContent {
  return landingPageContentSchema.parse(value);
}

export function safeParseLandingPageContent(
  value: unknown,
): LandingPageContent {
  const result = landingPageContentSchema.safeParse(value);
  return result.success
    ? normalizeLandingPageContent(result.data)
    : defaultLandingPageContent;
}

function normalizeLandingPageContent(
  content: LandingPageContent,
): LandingPageContent {
  if (content.footer.copyright !== previousCopyrightText) {
    return content;
  }

  return {
    ...content,
    footer: {
      ...content.footer,
      copyright: northlineCopyrightText,
    },
  };
}
