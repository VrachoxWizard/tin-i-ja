import { Metadata } from "next";
import { SellerOnboardingForm } from "@/components/features/SellerOnboardingForm";
import { EyeOff, Bot, Handshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Prodajte Tvrtku | DealFlow",
  description: "Započnite proces prodaje vaše tvrtke diskretno i sigurno.",
  alternates: { canonical: "/sell" },
};

export default function SellPage() {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Subtle structural grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-4 px-4 py-1.5 border border-white/10 text-muted-foreground text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-12">
            <span className="w-1.5 h-1.5 bg-primary" />
            Portal za Prodavatelje
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-foreground mb-8 leading-[1.05] tracking-tighter">
            Započnite prodaju{" "}
            <span className="italic font-light text-muted-foreground pr-2">
              tvrtke
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-20 tracking-wide font-light">
            Unesite podatke o vašoj tvrtki. Vaši stvarni podaci ostat će tajni
            sve do potpisivanja NDA ugovora. Naša AI tehnologija automatski će
            kreirati anonimni teaser i detektirati odgovarajuće investitore.
          </p>

          {/* 3-Step Visual Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 border border-white/5 p-px">
            {[
              { icon: EyeOff, label: "Anonimni Teaser", step: "01" },
              { icon: Bot, label: "AI Procjena", step: "02" },
              { icon: Handshake, label: "Diskretno Spajanje", step: "03" },
            ].map(({ icon: Icon, label, step }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-4 px-6 py-10 bg-card group transition-colors hover:bg-card/80"
              >
                <span className="text-[0.6rem] text-primary font-bold tracking-widest">
                  {step}
                </span>
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-500" strokeWidth={1} />
                <span className="text-sm text-foreground font-light tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <SellerOnboardingForm />
        </div>
      </section>
    </div>
  );
}
