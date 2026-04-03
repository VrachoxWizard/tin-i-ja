import type { Metadata } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { DM_Sans, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import "./globals.css";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { Preloader } from "@/components/ui/Preloader";
import { validateEnv } from "@/lib/env";

if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
  validateEnv();
}

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dealflow.hr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DealFlow | Diskretna M&A platforma za Hrvatsku",
    template: "%s | DealFlow",
  },
  description:
    "Diskretna hrvatska M&A platforma za prodavatelje i investitore: AI procjena, anonimni teaseri, NDA workflow i sigurni deal room.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "hr_HR",
    url: siteUrl,
    siteName: "DealFlow",
    title: "DealFlow | Diskretna M&A platforma za Hrvatsku",
    description:
      "AI procjena, anonimni teaseri, kvalificirana uparivanja i sigurni deal room za hrvatsko tržište prijenosa vlasništva.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "DealFlow — Diskretna M&A platforma za Hrvatsku",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DealFlow | Diskretna M&A platforma za Hrvatsku",
    description:
      "Platforma za diskretnu prodaju i kupnju tvrtki u Hrvatskoj.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hr"
      className={`dark ${inter.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NoiseOverlay />
        <Preloader>
          {children}
        </Preloader>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--card-foreground)",
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DealFlow",
              url: siteUrl,
              logo: `${siteUrl}/og-image.png`,
              description: "Diskretna hrvatska M&A platforma za prodavatelje i investitore.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Zagreb",
                addressCountry: "HR",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DealFlow",
              url: siteUrl,
              description: "AI procjena, anonimni teaseri, kvalificirana uparivanja i sigurni deal room za hrvatsko tržište.",
            }),
          }}
        />
      </body>
    </html>
  );
}
