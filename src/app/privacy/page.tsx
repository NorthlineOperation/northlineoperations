import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { getLandingPageContent } from "@/lib/cms/landing-page";
import { LEGAL_NAME, SITE_NAME } from "@/lib/seo/site";
import brandLogo from "../../../docs/logo.png";

export const dynamic = "force-dynamic";

const LAST_UPDATED = "June 21, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, shares, and protects the personal information you provide through our website.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default async function PrivacyPage() {
  const content = await getLandingPageContent();
  const { email, phone, location } = content.footer;

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-ink-gradient text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 sm:px-8">
          <Link
            href="/"
            aria-label="Northline Operation home"
            className="relative block h-12 w-32 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10 sm:h-14 sm:w-36"
          >
            <Image
              src={brandLogo}
              alt="Northline Operation"
              fill
              priority
              sizes="(min-width: 640px) 144px, 128px"
              className="object-cover object-[center_57%]"
            />
          </Link>
          <Link
            href="/"
            className="text-xs font-bold tracking-wider text-gold transition hover:text-white"
          >
            ← BACK TO SITE
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>

        <P>
          {SITE_NAME} (&ldquo;{SITE_NAME},&rdquo; &ldquo;Northline,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), operated by{" "}
          {LEGAL_NAME}, respects your privacy. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you
          visit our website or interact with us, and the choices you have. By
          using our website or submitting information to us, you agree to the
          practices described in this policy.
        </P>

        <H2>Information We Collect</H2>
        <P>
          <strong>Information you provide to us.</strong> We collect the
          information you submit through our forms, including our quote request,
          contact, and job application features. Depending on the form, this may
          include your name, email address, phone number, company or property
          name, property address and details, service preferences, the contents
          of your message, and : for job applicants : your résumé and related
          employment information.
        </P>
        <P>
          <strong>Information collected automatically.</strong> When you visit
          our website, our hosting and infrastructure providers may
          automatically collect limited technical information such as your IP
          address, browser type, device information, referring pages, and
          general usage data through server logs and similar technologies. This
          information helps us operate, secure, and improve the website.
        </P>

        <H2>How We Use Your Information</H2>
        <P>We use the information we collect to:</P>
        <List
          items={[
            "Respond to quote requests, questions, and other inquiries you submit;",
            "Prepare and provide quotes and deliver our commercial cleaning and site support services;",
            "Review and process job applications;",
            "Communicate with you about your request, our services, and scheduling;",
            "Operate, maintain, secure, and improve our website and business; and",
            "Comply with applicable legal obligations and enforce our agreements.",
          ]}
        />

        <H2>How We Share Your Information</H2>
        <P>
          We do <strong>not</strong> sell your personal information. We share
          information only as needed to operate our business, including with:
        </P>
        <List
          items={[
            "Service providers that host our website, store form submissions, and deliver email on our behalf, who are permitted to use the information only to provide services to us;",
            "Professional advisors such as accountants, attorneys, and insurers, where reasonably necessary;",
            "Authorities or other parties when required to comply with law, respond to legal process, or protect the rights, property, or safety of Northline, our clients, or others; and",
            "A successor entity in connection with a merger, acquisition, financing, or sale of business assets.",
          ]}
        />

        <H2>Cookies and Tracking Technologies</H2>
        <P>
          Our website uses only the cookies and similar technologies necessary
          for the site to function and to keep it secure. We do not use our
          website to serve third-party advertising. You can control or disable
          cookies through your browser settings, though some features may not
          work as intended if you do.
        </P>

        <H2>Data Retention</H2>
        <P>
          We retain personal information for as long as needed to fulfill the
          purposes described in this policy : for example, to respond to your
          request, provide services, maintain business and tax records, and
          comply with legal obligations : after which we delete or de-identify
          it.
        </P>

        <H2>Data Security</H2>
        <P>
          We use reasonable administrative, technical, and physical safeguards
          designed to protect your information. However, no method of
          transmission or storage is completely secure, and we cannot guarantee
          absolute security. In the event of a data breach affecting Ohio
          residents, we will provide notice as required by Ohio&rsquo;s data
          breach notification law (Ohio Revised Code § 1349.19) and any other
          applicable law.
        </P>

        <H2>Your Privacy Rights</H2>
        <P>
          Subject to applicable law, you may request to access, correct, update,
          or delete the personal information we hold about you, and you may opt
          out of non-essential marketing communications at any time. To make a
          request, contact us using the details below. We will respond
          consistent with applicable law and may need to verify your identity
          before acting on a request.
        </P>
        <P>
          <strong>Ohio residents.</strong> Ohio does not currently have a
          comprehensive consumer data privacy statute granting specific
          statutory rights; nonetheless, we honor reasonable requests to access
          or delete the information you have provided to us, as described above.
        </P>
        <P>
          <strong>Residents of other states.</strong> If you reside in a state
          with a comprehensive consumer privacy law (such as California,
          Colorado, Virginia, Connecticut, or Utah), you may have additional
          rights regarding your personal information, including rights to
          access, delete, correct, and opt out of certain processing. We do not
          sell personal information or use it for cross-context behavioral
          advertising. Contact us to exercise any rights available to you, and
          we will not discriminate against you for doing so.
        </P>

        <H2>Children&rsquo;s Privacy</H2>
        <P>
          Our website and services are intended for businesses and adults and
          are not directed to children under 13. We do not knowingly collect
          personal information from children under 13. If you believe a child
          has provided us personal information, please contact us and we will
          delete it.
        </P>

        <H2>Email Communications</H2>
        <P>
          If we send you commercial email, you may opt out by following the
          unsubscribe instructions in the message or by contacting us. We will
          continue to send transactional or service-related messages, such as
          responses to your inquiries, as permitted by law.
        </P>

        <H2>Third-Party Links</H2>
        <P>
          Our website may contain links to third-party websites or services. We
          are not responsible for the privacy practices of those third parties,
          and we encourage you to review their privacy policies.
        </P>

        <H2>Do Not Track</H2>
        <P>
          Our website does not respond differently to browser &ldquo;Do Not
          Track&rdquo; signals because no uniform standard for them has been
          adopted.
        </P>

        <H2>Changes to This Policy</H2>
        <P>
          We may update this Privacy Policy from time to time. When we do, we
          will revise the &ldquo;Last updated&rdquo; date above. Material
          changes will be reflected on this page, and your continued use of the
          website after changes become effective constitutes acceptance of the
          updated policy.
        </P>

        <H2>Contact Us</H2>
        <P>
          If you have questions about this Privacy Policy or wish to exercise
          your rights, please contact us:
        </P>
        <div className="mt-4 rounded-lg border bg-secondary p-5 text-sm">
          <div className="font-semibold text-ink">{SITE_NAME}</div>
          <div className="mt-2 text-muted-foreground">
            Email:{" "}
            <a href={`mailto:${email}`} className="text-gold hover:underline">
              {email}
            </a>
          </div>
          <div className="text-muted-foreground">
            Phone:{" "}
            <a href={`tel:${phone}`} className="text-gold hover:underline">
              {phone}
            </a>
          </div>
          <div className="text-muted-foreground">Location: {location}</div>
        </div>
      </article>
    </main>
  );
}

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-10 font-display text-2xl font-bold text-ink">
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 text-sm leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
