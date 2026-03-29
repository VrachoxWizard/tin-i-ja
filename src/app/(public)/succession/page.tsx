import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ShieldCheck, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Planiranje Nasljeđivanja | DealFlow",
  description:
    "Strateško planiranje nasljeđivanja vaše tvrtke. Osigurajte budućnost vašeg poslovanja s DealFlow platformom.",
};

export default function SuccessionPage() {
  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute top-[-15%] right-[-10%] w-125 h-125 bg-gold/15 rounded-full blur-[140px] gpu-layer" />
        <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-trust/10 rounded-full blur-[120px] gpu-layer" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium tracking-wide mb-8 backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-gold" />
            Uskoro Dostupno
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
            Planiranje{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gold via-yellow-200 to-gold">
              nasljeđivanja
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Strateški pristup prijenosu vlasništva vaše tvrtke. Osigurajte
            kontinuitet poslovanja, zaštitite zaposlenike i maksimizirajte
            vrijednost za sljedeću generaciju.
          </p>

          {/* Feature preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-16">
            {[
              {
                icon: Building2,
                label: "Procjena spremnosti",
                desc: "Analiza vaše tvrtke za prijenos",
              },
              {
                icon: ShieldCheck,
                label: "Pravna zaštita",
                desc: "Sukladnost s HR zakonodavstvom",
              },
              {
                icon: Clock,
                label: "Vremenski plan",
                desc: "Strukturirani proces prijenosa",
              },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 px-4 py-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <span className="text-sm text-white font-medium">{label}</span>
                <span className="text-xs text-slate-500">{desc}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500 mb-2">
              Budite među prvima koji će koristiti ovu uslugu.
            </p>
            <Link href="/valuate">
              <Button className="h-12 px-8 rounded-full bg-gold hover:bg-gold/90 text-navy font-heading font-bold text-base shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                Procijeni vrijednost tvrtke
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
