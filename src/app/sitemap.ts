import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dealflow.hr";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/listings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/sell`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/buy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/valuate`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/succession`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Fetch active listing IDs for dynamic routes
  let listingRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: listings } = await supabase
      .from("listings")
      .select("id, updated_at")
      .eq("status", "active");

    if (listings) {
      listingRoutes = listings.map((listing) => ({
        url: `${siteUrl}/listings/${listing.id}`,
        lastModified: listing.updated_at ? new Date(listing.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Silently fail — static routes still get indexed
  }

  return [...staticRoutes, ...listingRoutes];
}
