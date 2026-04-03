import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Clock, ShieldCheck, Sparkles } from "lucide-react";

const ValuatorWizard = dynamic(
  () =>
    import("@/components/features/ValuatorWizard").then(
      (mod) => mod.ValuatorWizard,
    ),
  {
    loading: () => (
      <div className="h-[500px] animate-pulse bg-card border border-border rounded-none" />
    ),
  },
);

export const metadata: Metadata = {
  title: "AI procjena vrijednosti tvrtke | DealFlow",
  description:
    "Anonimna AI procjena vrijednosti tvrtke s EBITDA i SDE rasponima te sell-readiness scoreom.",
  alternates: { canonical: "/valuate" },
};

export default function ValuatePage() {
  return (
    <div className="flex flex-col bg-background">
      <section className="relative border-b border-border bg-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(21,101,192,0.08),transparent_42%)]" />
        <div className="container relative mx-auto max-w-6xl px-4 pt-18 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              AI valuator
            </p>
            <h1>Saznajte raspon vrijednosti prije izlaska na tržište.</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Unesite osnovne financijske i operativne pokazatelje te dobijte
              inicijalni EBITDA i SDE raspon zajedno sa sell-readiness scoreom i
              preporukama za povećanje atraktivnosti tvrtke.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { icon: Clock, text: "Rezultat za nekoliko minuta" },
              { icon: ShieldCheck, text: "Podaci ostaju povjerljivi" },
              { icon: Sparkles, text: "AI narativ i preporuke" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
              >
                <Icon className="w-4 h-4 text-primary" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-3xl">
          <ValuatorWizard />
        </div>
      </section>
    </div>
  );
}
