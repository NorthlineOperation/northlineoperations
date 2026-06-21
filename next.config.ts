import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (supabaseUrl) {
  const parsedUrl = new URL(supabaseUrl);

  remotePatterns.push({
    protocol: parsedUrl.protocol.replace(":", "") as "http" | "https",
    hostname: parsedUrl.hostname,
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  // Ensure the admin manual markdown ships with the server bundle so the
  // /admin/manual page can read it at runtime in production.
  outputFileTracingIncludes: {
    "/admin/manual": ["./docs/ADMIN_MANUAL.md"],
  },
};

export default nextConfig;
