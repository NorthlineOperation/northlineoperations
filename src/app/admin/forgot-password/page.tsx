import Link from "next/link";

import { AdminForgotPasswordForm } from "@/app/admin/forgot-password/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset admin password</CardTitle>
          <CardDescription>
            Enter the admin email address and Supabase will send a secure reset
            link.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <AdminForgotPasswordForm />
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
