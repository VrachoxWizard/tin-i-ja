import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dealflow.hr";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/", "/login", "/register", "/forgot-password", "/update-password"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
