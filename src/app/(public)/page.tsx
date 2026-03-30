import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { ValuePropsBar } from "@/components/sections/ValuePropsBar";
import { DualJourneySection } from "@/components/sections/DualJourneySection";
import { GalleryCarousel } from "@/components/sections/GalleryCarousel";
import { FeaturesBento } from "@/components/sections/FeaturesBento";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "DealFlow | Premium M&A Platforma za Hrvatsku",
  description:
    "Spajamo vlasnike tvrtki s kvalificiranim investitorima. Diskretna AI procjena, anonimni profili i sigurno pregovaranje na hrvatskom tržištu.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DealFlow",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dealflow.hr",
  description:
    "Premium M&A platforma za Hrvatsku — spajamo vlasnike tvrtki s kvalificiranim investitorima.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Zagreb",
    addressCountry: "HR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@dealflow.hr",
    telephone: "+385-1-234-5678",
    contactType: "customer service",
    availableLanguage: "Croatian",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-foreground overflow-x-hidden selection:bg-gold/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ValuePropsBar />
      <DualJourneySection />
      <GalleryCarousel />
      <FeaturesBento />
      <ProcessSection />
      <TrustSection />
      <FinalCTA />
    </div>
  );
}
