import { Metadata } from "next";
import { SellerOnboardingForm } from "@/components/features/SellerOnboardingForm";
import { EyeOff, Bot, Handshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Prodajte Tvrtku | DealFlow",
  description: "Započnite proces prodaje vaše tvrtke diskretno i sigurno.",
};

export default function SellPage() {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute top-[-15%] left-[-10%] w-125 h-125 bg-gold/15 rounded-full blur-[140px] gpu-layer" />
        <div className="absolute bottom-[-10%] right-[-10%] w-100 h-100 bg-trust/10 rounded-full blur-[120px] gpu-layer" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium tracking-wide mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            Portal za Prodavatelje
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
            Započnite prodaju{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gold via-yellow-200 to-gold">
              tvrtke
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Unesite podatke o vašoj tvrtki. Vaši stvarni podaci ostat će tajni
            sve do potpisivanja NDA ugovora. Naša AI tehnologija automatski će
            kreirati anonimni teaser.
          </p>

          {/* 3-Step Visual Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: EyeOff, label: "Anonimni Teaser", step: "01" },
              { icon: Bot, label: "AI Procjena", step: "02" },
              { icon: Handshake, label: "Diskretno Spajanje", step: "03" },
            ].map(({ icon: Icon, label, step }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm group"
              >
                <span className="text-xs text-gold/60 font-heading font-bold">
                  {step}
                </span>
                <Icon className="w-4 h-4 text-gold" />
                <span className="text-sm text-slate-300 font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative -mt-6 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <SellerOnboardingForm />
        </div>
      </section>
    </div>
  );
}
