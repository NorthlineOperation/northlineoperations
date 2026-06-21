import { BookOpen, Building2, FileText, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { AdminInactivityTimeout } from "@/components/admin/inactivity-timeout";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Landing Page", href: "/admin/landing-page", icon: FileText },
  { label: "Manual", href: "/admin/manual", icon: BookOpen },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-secondary text-foreground">
      <AdminInactivityTimeout />
      <aside
        data-testid="admin-sidebar"
        className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r bg-background lg:flex"
        style={{ height: "100vh" }}
      >
        <div className="flex shrink-0 flex-col gap-8 px-5 py-6">
          <Link href="/admin" className="flex min-w-0 items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-display text-lg font-bold leading-none">
                Northline
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                CMS
              </div>
            </div>
          </Link>

          <nav data-testid="admin-sidebar-nav" className="flex flex-col gap-1">
            <div className="px-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Manage
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex min-h-10 min-w-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="min-h-0 flex-1" />

        <div data-testid="admin-account" className="shrink-0 border-t p-4">
          <div className="flex flex-col gap-3 rounded-md bg-secondary p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{admin.email}</p>
              <div className="mt-2">
                <Badge variant="secondary">Admin</Badge>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div data-testid="admin-content" className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b bg-background/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <Link
              href="/admin"
              className="min-w-0 truncate font-display text-xl font-bold lg:hidden"
            >
              Northline CMS
            </Link>
            <div className="hidden min-w-0 truncate text-sm text-muted-foreground lg:block">
              Content management for Northline Building Services
            </div>
            <nav className="hidden shrink-0 gap-1 sm:flex lg:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="shrink-0 lg:hidden">
              <SignOutButton />
            </div>
          </div>
        </header>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
