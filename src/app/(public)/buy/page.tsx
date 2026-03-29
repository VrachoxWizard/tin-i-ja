import { Metadata } from "next";
import { BuyerOnboardingForm } from "@/components/features/BuyerOnboardingForm";
import { Shield, FileCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Kupite Tvrtku | DealFlow",
  description:
    "Pronađite idealnu tvrtku za akviziciju. Kriterijski potpomognuto spajanje.",
};

export default function BuyPage() {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute top-[-20%] right-[-10%] w-125 h-125 bg-trust/15 rounded-full blur-[140px] gpu-layer" />
        <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-gold/10 rounded-full blur-[120px] gpu-layer" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium tracking-wide mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-trust shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
            Investitorski Portal
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
            Postanite DealFlow{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-trust via-blue-400 to-indigo-300">
              Investitor
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Registrirajte svoje investicijske kriterije. Naš algoritam
            automatski će vas spojiti s visoko profitabilnim i provjerenim
            tvrtkama na hrvatskom tržištu.
          </p>

          {/* Trust signals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Shield, label: "100% diskretno" },
              { icon: FileCheck, label: "NDA zaštita" },
              { icon: Users, label: "Verificirani kupci" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
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
          <BuyerOnboardingForm />
        </div>
      </section>
    </div>
  );
}
