import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { ValuePropsBar } from "@/components/sections/ValuePropsBar";
import { DualJourneySection } from "@/components/sections/DualJourneySection";
import { FeaturesBento } from "@/components/sections/FeaturesBento";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "DealFlow | Premium M&A Platforma za Hrvatsku",
  description:
    "Spajamo vlasnike tvrtki s kvalificiranim investitorima. Diskretna AI procjena, anonimni profili i sigurno pregovaranje na hrvatskom tržištu.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-foreground overflow-x-hidden selection:bg-gold/30 selection:text-white">
      <HeroSection />
      <ValuePropsBar />
      <DualJourneySection />
      <FeaturesBento />
      <ProcessSection />
      <TrustSection />
      <FinalCTA />
    </div>
  );
}
