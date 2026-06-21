"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000;

const ACTIVITY_EVENTS = [
  "click",
  "keydown",
  "mousemove",
  "pointerdown",
  "scroll",
  "touchstart",
  "wheel",
] as const;

export function AdminInactivityTimeout() {
  const router = useRouter();

  useEffect(() => {
    let timeoutId: number | undefined;
    let hasTimedOut = false;

    async function signOutForInactivity() {
      if (hasTimedOut) {
        return;
      }

      hasTimedOut = true;
      const supabase = createBrowserSupabaseClient();

      try {
        await supabase.auth.signOut();
      } finally {
        router.replace("/admin/login?timeout=1");
        router.refresh();
      }
    }

    function resetTimer() {
      if (hasTimedOut) {
        return;
      }

      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(
        signOutForInactivity,
        ADMIN_IDLE_TIMEOUT_MS,
      );
    }

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      window.clearTimeout(timeoutId);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });
    };
  }, [router]);

  return null;
}
