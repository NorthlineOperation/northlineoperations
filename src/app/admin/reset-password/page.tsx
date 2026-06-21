import Link from "next/link";

import { AdminResetPasswordForm } from "@/app/admin/reset-password/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create a new password</CardTitle>
          <CardDescription>
            Use the reset link from your email to update the CMS admin password.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <AdminResetPasswordForm />
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
