"use client";

import { useEffect, useRef, useState } from "react";

import { LandingPage } from "@/components/site/landing-page";
import {
  safeParseLandingPageContent,
  type LandingPageContent,
} from "@/lib/cms/landing-page-content";
import {
  PREVIEW_MESSAGE_TYPE,
  PREVIEW_READY_TYPE,
  type PreviewContentMessage,
} from "@/lib/cms/preview-messages";

function isPreviewMessage(data: unknown): data is PreviewContentMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { type?: unknown }).type === PREVIEW_MESSAGE_TYPE
  );
}

/**
 * Renders the live public landing page inside the CMS preview iframe. The editor
 * posts its current (unsaved) content here on every change, so the admin sees
 * exactly how the site will look before publishing. No data is persisted.
 */
export function LandingPagePreview({
  initialContent,
}: {
  initialContent: LandingPageContent;
}) {
  const [content, setContent] = useState<LandingPageContent>(initialContent);
  const hasReceived = useRef(false);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Only trust messages from the same origin (the CMS editor parent frame).
      if (event.origin !== window.location.origin) {
        return;
      }

      if (!isPreviewMessage(event.data)) {
        return;
      }

      hasReceived.current = true;
      setContent(safeParseLandingPageContent(event.data.content));
    }

    window.addEventListener("message", handleMessage);

    // Tell the parent we are mounted and ready to receive content.
    window.parent?.postMessage(
      { type: PREVIEW_READY_TYPE },
      window.location.origin,
    );

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return <LandingPage content={content} reviews={null} />;
}
