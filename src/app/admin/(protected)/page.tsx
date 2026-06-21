import { Database, FileText, FileUp, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSupabaseStorageBucket } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

const foundationItems = [
  {
    title: "Landing Page CMS",
    description:
      "The public landing page is loaded from editable CMS content with a safe fallback.",
    icon: FileText,
  },
  {
    title: "Supabase Auth",
    description:
      "Admin access is guarded by Supabase Auth and app metadata roles.",
    icon: ShieldCheck,
  },
  {
    title: "Postgres CMS",
    description:
      "Page content, media references, service details, and inquiry records will live in Supabase Postgres.",
    icon: Database,
  },
  {
    title: "Storage Bucket",
    description:
      "CMS images, documents, and uploads will use Supabase Storage.",
    icon: FileUp,
  },
  {
    title: "Next.js APIs",
    description:
      "Server-side CMS endpoints will run as Next.js route handlers.",
    icon: Users,
  },
];

export default function AdminDashboardPage() {
  const bucket = getSupabaseStorageBucket();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Badge className="w-fit" variant="outline">
          CMS foundation
        </Badge>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Admin CMS
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Manage the Northline landing page content from the protected CMS.
            Supabase Auth guards access and Next.js APIs handle content writes.
          </p>
        </div>
        <div>
          <Button asChild>
            <Link href="/admin/landing-page">
              <FileText data-icon="inline-start" />
              Edit landing page
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {foundationItems.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription className="mt-2">
                  {item.description}
                </CardDescription>
              </div>
              <item.icon className="size-5 text-muted-foreground" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Current backend assumptions for the CMS integration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-md border bg-secondary p-4">
              <dt className="font-medium">Storage bucket</dt>
              <dd className="mt-1 text-muted-foreground">{bucket}</dd>
            </div>
            <div className="rounded-md border bg-secondary p-4">
              <dt className="font-medium">Admin role source</dt>
              <dd className="mt-1 text-muted-foreground">
                Supabase user app_metadata.role = admin
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
