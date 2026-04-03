import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Lock,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TeaserCard } from "@/components/features/TeaserCard";
import { Button } from "@/components/ui/button";
import { FadeInView } from "@/components/ui/FadeInView";
import { Hero3D } from "@/components/hero-3d";
import { Magnetic } from "@/components/ui/Magnetic";

export const metadata: Metadata = {
  title: "DealFlow | Diskretna M&A platforma za Hrvatsku",
  description:
    "AI procjena, anonimni teaseri, kvalificirana uparivanja i sigurni deal room za diskretnu prodaju i kupnju tvrtki u Hrvatskoj.",
  alternates: { canonical: "/" },
};

const features = [
  {
    title: "01. Diskrecija",
    body: "Povjerljivost prije svega. AI generira blind teasere bez probijanja identiteta.",
  },
  {
    title: "02. Match Engine",
    body: "EBITDA parametri i industrija povezuju Vaš kapital s verificiranim prilikama.",
  },
  {
    title: "03. Data Room",
    body: "Puni pristup dubinskom snimanju otključava se isključivo potpisom NDA ugovora.",
  },
];

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
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">

      {/* ── AVANT-GARDE HERO ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[100vh] flex items-center border-b border-border/20 pt-20">
        <Hero3D />

        {/* Abstract large typography background element */}
        <div className="absolute top-1/4 left-[-5%] text-[15vw] font-heading font-black text-foreground/5 whitespace-nowrap pointer-events-none select-none overflow-hidden z-0 tracking-tighter mix-blend-overlay">
          M&A EXCELLENCE
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">

            <div className="space-y-12">
              <FadeInView delay={0.05}>
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-primary"></div>
                  <span className="text-[0.65rem] uppercase tracking-[0.3em] text-primary font-bold">Kapital Ekosustav</span>
                </div>
              </FadeInView>

              <FadeInView delay={0.1}>
                <h1 className="font-heading font-black leading-[0.9] tracking-tighter text-foreground uppercase">
                  <span className="block text-[clamp(3.5rem,7vw,6.5rem)] ml-[-4px]">Diskretan</span>
                  <span className="block text-[clamp(3.5rem,7vw,6.5rem)] ml-[-4px] text-transparent clip-text-gold bg-clip-text text-glow-gold relative z-10">Prijenos</span>
                  <span className="block text-[clamp(3.5rem,7vw,6.5rem)] ml-[-4px]">Vlasništva.</span>
                </h1>
              </FadeInView>

              <FadeInView delay={0.2}>
                <p className="max-w-md text-lg text-muted-foreground leading-relaxed pl-8 border-l border-primary/30">
                  DealFlow je vrhunska arhitektura za prijenos vrijednosti. Sinergija AI vrednovanja i zatvorene mreže kapitala u Hrvatskoj.
                </p>
              </FadeInView>

              <FadeInView delay={0.3}>
                <div className="flex flex-wrap gap-6 pt-4">
                  <Magnetic strength={25}>
                    <Link href="/sell" className="inline-block">
                      <Button className="h-16 px-10 rounded-none border border-primary/50 btn-shimmer bg-card-elevated/80 backdrop-blur-md text-foreground text-sm uppercase tracking-[0.2em] shadow-glow-gold hover:translate-y-[-2px] transition-all duration-500">
                        Započni Prijenos
                        <ArrowRight className="w-4 h-4 ml-4" />
                      </Button>
                    </Link>
                  </Magnetic>
                </div>
              </FadeInView>
            </div>

            {/* Asymmetrical Framed Image Right */}
            <FadeInView delay={0.4} yOffset={50}>
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative z-10 aspect-[3/4] max-h-[70vh] border border-primary/20 bg-card-elevated/40 backdrop-blur-sm p-4 shadow-glass-elevated transition-transform duration-700 group-hover:scale-[1.02]">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
                    alt="Corporate Architecture"
                    className="w-full h-full object-cover filter contrast-125 saturate-50 mix-blend-luminosity opacity-80"
                    loading="lazy"
                  />
                  <Magnetic strength={15}>
                    <div className="absolute bottom-10 -left-10 bg-card-elevated/90 backdrop-blur-xl border border-primary/40 shadow-glow-gold p-6 max-w-[240px]">
                      <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                      <p className="text-xs uppercase tracking-[0.2em] font-bold">100% Povjerljivo</p>
                    </div>
                  </Magnetic>
                </div>
              </div>
            </FadeInView>

          </div>
        </div>
      </section>

      {/* ── METRICS PARALLAX BREAK ───────────────────────────────────────────── */}
      <section className="relative py-32 border-b border-border/20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541888081622-446a81bb1a7e?q=80&w=2000"
            alt="Glass skyscraper abstract"
            className="w-full h-full object-cover object-center fixed opacity-10"
            loading="lazy"
          />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-16 divide-x divide-border/20">
            {[
              { num: "60+", label: "Ekskluzivnih Matchinga", sub: "Mjesečno" },
              { num: "0", label: "Probijenih Identiteta", sub: "Sigurnost" },
              { num: "AI", label: "Procjena Vrijednosti", sub: "Preciznost" }
            ].map((stat, i) => (
              <FadeInView key={stat.label} delay={0.1 * i} className="pl-8 first:pl-0">
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-primary mb-6">{stat.sub}</p>
                <p className="text-5xl lg:text-7xl font-heading font-black text-transparent clip-text-gold bg-clip-text text-glow-gold tracking-tighter mb-4">{stat.num}</p>
                <p className="text-sm font-semibold text-foreground uppercase tracking-[0.2em]">{stat.label}</p>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROTOCOL & IMAGES MIX ───────────────────────────────────────────── */}
      <section className="py-32 relative border-b border-border/20 bg-card-elevated/10">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">

          <div className="flex flex-col lg:flex-row gap-20 items-center">

            {/* Left Image grid */}
            <div className="w-full lg:w-1/2 relative h-[600px]">
              <FadeInView delay={0.1}>
                <div className="absolute top-0 right-0 w-[80%] h-[75%] border border-border/20 shadow-glass-elevated overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-30 group-hover:opacity-0 transition-opacity" />
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000"
                    alt="Luxury office"
                    className="w-full h-full object-cover filter grayscale contrast-125 transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </FadeInView>
              <FadeInView delay={0.3} yOffset={-30}>
                <div className="absolute bottom-0 left-0 w-[55%] h-[50%] border border-primary/30 p-2 bg-card-elevated/40 backdrop-blur-md shadow-glow-gold z-20">
                  <div className="w-full h-full border border-border/20 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632"
                      alt="Business meeting"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                      loading="lazy"
                    />
                  </div>
                </div>
              </FadeInView>
            </div>

            {/* Right Text */}
            <div className="w-full lg:w-1/2 pt-10 lg:pt-0">
              <FadeInView>
                <div className="flex items-center gap-4 mb-10">
                  <div className="h-[1px] w-12 bg-primary"></div>
                  <span className="text-[0.65rem] uppercase tracking-[0.3em] text-primary font-bold">Standard Usluge</span>
                </div>
                <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-heading font-black tracking-tighter leading-[1.05] mb-16 uppercase relative inline-block">
                  Arhitektura ugovora.
                  <span className="block text-transparent clip-text-gold bg-clip-text text-glow-gold">Zatvoreni krug.</span>
                </h2>
              </FadeInView>

              <div className="space-y-12">
                {features.map((f, i) => (
                  <FadeInView key={f.title} delay={0.1 * i}>
                    <div className="group border-l border-primary/20 pl-8 hover:border-primary transition-colors duration-500">
                      <h3 className="text-xl font-heading font-bold text-foreground mb-3 tracking-wide">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{f.body}</p>
                    </div>
                  </FadeInView>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── THE VAULT (LISTINGS) ─────────────────────────────────────── */}
      <section className="py-40 relative overflow-hidden bg-card-elevated/5">
        <div className="absolute top-0 right-[-20%] w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
          <FadeInView>
            <div className="text-center mb-24 flex flex-col items-center">
              <Lock className="w-10 h-10 text-primary mb-8 animate-float" />
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-primary font-bold mb-6">
                Ekskluzivni Trezor
              </p>
              <h2 className="text-[clamp(3rem,6vw,5rem)] font-heading font-black text-foreground tracking-tighter uppercase mb-10">
                Aktivne Prilike
              </h2>
              <Magnetic strength={15}>
                <Link href="/listings" className="inline-block">
                  <Button variant="outline" className="h-14 px-8 rounded-none border-primary/40 text-xs tracking-[0.2em] bg-transparent hover:bg-card-elevated shadow-glow-gold hover:text-primary transition-all duration-500 uppercase">
                    Pristupi Trezoru
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </FadeInView>

          {featuredListings.length > 0 ? (
            <div className="grid gap-12 lg:grid-cols-2 relative max-w-5xl mx-auto">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/20 hidden lg:block" />
              {featuredListings.map((listing, i) => (
                <FadeInView key={listing.id} delay={i * 0.15}>
                  <div className={`group relative transform transition-transform duration-700 hover:scale-[1.03] ${i === 1 ? 'lg:mt-32' : ''}`}>
                    <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="relative border border-border/30 bg-card-elevated/40 backdrop-blur-xl shadow-glass group-hover:border-primary/50 transition-all duration-700 p-2">
                      <div className="border border-border/20 h-full w-full pointer-events-none absolute inset-0 z-0 m-2 mix-blend-overlay" />
                      <TeaserCard
                        publicCode={listing.public_code}
                        industry={listing.industry_nkd}
                        region={listing.region}
                        revenue={listing.revenue_eur}
                        ebitda={listing.ebitda_eur}
                        askingPrice={listing.asking_price_eur}
                        blindTeaserHtml={listing.blind_teaser || ""}
                      />
                    </div>
                  </div>
                </FadeInView>
              ))}
            </div>
          ) : (
            <FadeInView>
              <div className="max-w-2xl mx-auto border border-solid border-border/40 bg-card-elevated/20 p-20 text-center shadow-glass relative overload-hidden before:absolute before:inset-0 before:bg-[url('/noise.png')] before:opacity-10 before:mix-blend-overlay">
                <Building2 className="w-12 h-12 text-primary/70 mx-auto mb-8 relative z-10" />
                <p className="text-muted-foreground leading-relaxed text-sm uppercase tracking-widest relative z-10 font-bold">
                  Sve prilike su trenutno pod ekskluzivnim ugovorom.
                </p>
              </div>
            </FadeInView>
          )}
        </div>
      </section>

      {/* ── FINAL MONUMENTAL CTA ─────────────────────────────────────────────── */}
      <section className="py-40 border-t border-border/20 relative overflow-hidden bg-[#02050A]">
        {/* Deep architectural background image for CTA */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"
            alt="Exit strategy"
            className="w-full h-full object-cover object-center filter grayscale opacity-10"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#02050A] via-transparent to-[#02050A] z-0" />

        <div className="container relative mx-auto max-w-4xl px-4 text-center z-10">
          <FadeInView>
            <div className="inline-flex items-center justify-center w-20 h-20 border border-primary/30 rounded-none bg-primary/5 mb-12 shadow-glow-gold backdrop-blur-md">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-[clamp(3.5rem,7vw,6rem)] font-heading font-black text-foreground tracking-tighter mb-10 leading-[0.9] uppercase">
              Vrijeme za <br />
              <span className="text-transparent clip-text-gold bg-clip-text text-glow-gold">Egzit.</span>
            </h2>

            <p className="text-sm uppercase tracking-[0.3em] font-bold text-muted-foreground/80 leading-relaxed mb-16 max-w-lg mx-auto border-y border-border/20 py-6">
              AI procjena • Analiza Kapitala • Prijenos
            </p>

            <Magnetic strength={30}>
              <Link href="/sell" className="inline-block">
                <Button className="h-16 px-12 rounded-none border border-primary/50 btn-shimmer bg-primary/10 backdrop-blur-xl text-foreground text-xs uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] transition-all duration-700">
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
