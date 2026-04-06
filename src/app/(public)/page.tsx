import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Lock, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { FadeInView } from "@/components/ui/FadeInView";
import { HeroCinematic } from "@/components/hero-cinematic";
import { HeroContent } from "@/components/ui/HeroContent";
import { Magnetic } from "@/components/ui/Magnetic";
import { AnimatedStat, TrustMarquee } from "@/components/ui/LandingAnimations";
import dynamic from "next/dynamic";

const ProtocolSection = dynamic(() => import("@/components/ui/ProtocolSection").then(m => m.ProtocolSection), { ssr: true });
const VaultSection = dynamic(() => import("@/components/ui/VaultSection").then(m => m.VaultSection), { ssr: true });

export const metadata: Metadata = {
  title: "DealFlow | Diskretna M&A platforma za Hrvatsku",
  description:
    "AI procjena, anonimni teaseri, kvalificirana uparivanja i sigurni deal room za diskretnu prodaju i kupnju tvrtki u Hrvatskoj.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("id, public_code, industry_nkd, region, revenue_eur, ebitda_eur, asking_price_eur, blind_teaser")
    .in("status", ["active", "under_nda"])
    .order("updated_at", { ascending: false })
    .limit(2);

  const featuredListings = data ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-background relative">

      {/* ── AVANT-GARDE HERO ─────────────────────────────────────────────────── */}
      <section id="hero-section" className="relative min-h-[100vh] flex flex-col justify-center border-b border-border/20 pt-20 pb-16 overflow-hidden">
        {/* Cinematic background depth layer */}
        <HeroCinematic />

        {/* Abstract watermark typography */}
        <div
          className="absolute top-1/4 left-[-5%] text-[15vw] font-heading font-black
            text-foreground/[0.03] whitespace-nowrap pointer-events-none select-none
            overflow-hidden z-[1] tracking-tighter mix-blend-overlay"
          aria-hidden="true"
        >
          M&amp;A EXCELLENCE
        </div>

        {/* GSAP-animated hero content: h1 stagger, floating image, mouse parallax */}
        <HeroContent />

        {/* Trust marquee ticker — pinned to bottom of hero */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <TrustMarquee />
        </div>
      </section>

      {/* ── METRICS PARALLAX BREAK ──────────────────────────────────────────── */}
      <section className="relative py-32 border-b border-border/20 overflow-hidden">
        {/* Background image — atmospheric only */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero_bg.png"
            alt="Glass skyscraper abstract"
            fill
            loading="lazy"
            className="object-cover object-center opacity-8"
            sizes="100vw"
          />
          {/* Dark overlay to keep text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
        </div>

        {/* Single FadeInView block for the whole metrics section */}
        <FadeInView>
          <div className="container relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-16 divide-x divide-border/20">
              <AnimatedStat num={60} suffix="+" label="Ekskluzivnih Matchinga" sub="Mjesečno" />
              <AnimatedStat num={0} label="Probijenih Identiteta" sub="Sigurnost" />
              <AnimatedStat num={"AI"} label="Procjena Vrijednosti" sub="Preciznost" />
            </div>
          </div>
        </FadeInView>
      </section>

      {/* ── PROTOCOL & IMAGES — GSAP ScrollTrigger parallax + 3D diorama ────── */}
      <ProtocolSection />

      {/* ── THE VAULT (LISTINGS) — Isometric GSAP reveal ────────────────────── */}
      <VaultSection featuredListings={featuredListings} />

      {/* ── FINAL MONUMENTAL CTA ─────────────────────────────────────────────── */}
      <section className="py-48 border-t border-border/20 relative overflow-hidden bg-[#010408]">
        {/* Deep architectural background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/cta_bg.png"
            alt="Exit strategy"
            fill
            loading="lazy"
            className="object-cover object-center filter grayscale opacity-8"
            sizes="100vw"
          />
        </div>
        {/* Top + Bottom gradient vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#010408] via-transparent to-[#010408] z-0" />

        {/* Ambient gold glow — subtle center radial */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[600px] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Single FadeInView for entire CTA block */}
        <div className="container relative mx-auto max-w-4xl px-4 text-center z-10">
          <FadeInView yOffset={40}>
            <div
              className="inline-flex items-center justify-center w-20 h-20 border border-primary/25
                bg-primary/5 mb-12 shadow-ambient-gold"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>

            <h2
              className="text-[clamp(4.5rem,11vw,10.5rem)] font-heading font-black text-foreground
                tracking-[-0.04em] mb-12 leading-[0.85] uppercase"
            >
              Vrijeme za <br />
              <span className="text-transparent clip-text-gold bg-clip-text text-glow-gold">
                Egzit.
              </span>
            </h2>

            <p
              className="text-sm uppercase tracking-[0.3em] font-bold text-muted-foreground/80
                leading-relaxed mb-16 max-w-lg mx-auto border-y border-border/20 py-6"
            >
              AI procjena • Analiza Kapitala • Prijenos
            </p>

            <Magnetic strength={30}>
              <Link href="/sell" className="inline-block">
                <Button
                  className="h-16 px-12 rounded-none border border-primary/50 btn-shimmer
                    bg-primary/10 text-foreground text-xs uppercase tracking-[0.25em]
                    shadow-[0_0_40px_rgba(201,168,76,0.15)]
                    hover:shadow-[0_0_60px_rgba(201,168,76,0.30)]
                    transition-all duration-300 cursor-pointer"
                >
                  Pokrenite Proces
                  <Lock className="w-4 h-4 ml-4" />
                </Button>
              </Link>
            </Magnetic>
          </FadeInView>
        </div>
      </section>

    </div>
  );
}
