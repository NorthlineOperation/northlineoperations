import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type AdminMetadata = {
  role?: unknown;
  roles?: unknown;
  is_admin?: unknown;
};

export function hasAdminRole(user: Pick<User, "app_metadata"> | null) {
  const metadata = (user?.app_metadata ?? {}) as AdminMetadata;

  if (metadata.role === "admin" || metadata.is_admin === true) {
    return true;
  }

  if (Array.isArray(metadata.roles)) {
    return metadata.roles.includes("admin");
  }

  if (typeof metadata.roles === "string") {
    return metadata.roles
      .split(",")
      .map((role) => role.trim())
      .includes("admin");
  }

  return false;
}

export async function getCurrentAdmin() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user || !hasAdminRole(user)) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
