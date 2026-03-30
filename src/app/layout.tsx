import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dealflow.hr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DealFlow | Premium M&A Platforma za Hrvatsku",
    template: "%s | DealFlow",
  },
  description:
    "Spajamo vlasnike tvrtki s kvalificiranim investitorima. Diskretna AI procjena, anonimni profili i sigurno pregovaranje na hrvatskom tržištu.",
  openGraph: {
    type: "website",
    locale: "hr_HR",
    url: siteUrl,
    siteName: "DealFlow",
    title: "DealFlow | Premium M&A Platforma za Hrvatsku",
    description:
      "Spajamo vlasnike tvrtki s kvalificiranim investitorima. Diskretna AI procjena, anonimni profili i sigurno pregovaranje na hrvatskom tržištu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DealFlow | Premium M&A Platforma za Hrvatsku",
    description:
      "Spajamo vlasnike tvrtki s kvalificiranim investitorima u Hrvatskoj.",
  },
  alternates: {
    canonical: siteUrl,
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
      className={`${inter.variable} ${playfair.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <NoiseOverlay />
        <ScrollToTop />
        <SmoothScroll>{children}</SmoothScroll>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#112240",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fafafa",
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
