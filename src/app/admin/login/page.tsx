import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/app/admin/login/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  let admin = null;

  try {
    admin = await getCurrentAdmin();
  } catch {
    // Supabase env vars may not exist during initial CMS setup.
  }

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Northline CMS</CardTitle>
          <CardDescription>
            Sign in with a Supabase admin account to manage site content.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <AdminLoginForm />
          <Link
            href="/"
            className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Return to public site
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
