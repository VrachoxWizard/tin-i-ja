import { ValuatorWizard } from "@/components/features/ValuatorWizard";
import { Sparkles, Clock, ShieldCheck } from "lucide-react";

export default function ValuatePage() {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute top-[-10%] left-[20%] w-150 h-150 bg-gold/15 rounded-full blur-[160px] gpu-layer" />
        <div className="absolute bottom-[-20%] right-[10%] w-100 h-100 bg-trust/10 rounded-full blur-[120px] gpu-layer" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium tracking-wide mb-8 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            AI Valuator — Besplatno
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight mb-6 leading-[1.05]">
            <span className="text-white">Koliko vrijedi </span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gold via-yellow-200 to-gold">
              vaša tvrtka?
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Anonimno, brzo i podržano najnovijom M&A analitikom za hrvatsko
            tržište. Saznajte raspone vrijednosti u minutama.
          </p>

          {/* Social proof + feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {[
              { icon: Clock, text: "Rezultat za 2 minute" },
              { icon: ShieldCheck, text: "100% anonimno" },
              { icon: Sparkles, text: "250+ procjena generirano" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <Icon className="w-3.5 h-3.5 text-gold/80" />
                <span className="text-xs text-slate-400 font-medium">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard Section */}
      <section className="relative -mt-6 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <ValuatorWizard />
        </div>
      </section>
    </div>
  );
}
