import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, TimerReset, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Planiranje nasljeđivanja | DealFlow",
  description:
    "Pripremite tvrtku za prijenos vlasništva kroz procjenu spremnosti, strukturirani plan i kontroliranu tranziciju.",
  alternates: { canonical: "/succession" },
};

export default function SuccessionPage() {
  return (
    <div className="flex flex-col bg-background">
      <section className="relative border-b border-border bg-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(21,101,192,0.08),transparent_42%)]" />
        <div className="container relative mx-auto max-w-6xl px-4 pt-18 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              Prijenos vlasništva
            </p>
            <h1>Strukturirajte nasljeđivanje prije nego što postane hitno.</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Plan prijenosa vlasništva treba obuhvatiti spremnost tima,
              dokumentiranost procesa, kontinuitet odnosa s klijentima i jasan
              vremenski plan tranzicije.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              {
                icon: Building2,
                title: "Spremnost tvrtke",
                body: "Procjena ovisnosti o vlasniku, procesa i operativne zrelosti.",
              },
              {
                icon: Users,
                title: "Prijenos odnosa",
                body: "Mapiranje ključnih kupaca, zaposlenika i odgovornosti.",
              },
              {
                icon: ShieldCheck,
                title: "Kontrola rizika",
                body: "Rano zatvaranje pravnih i operativnih slabih točaka.",
              },
              {
                icon: TimerReset,
                title: "Vremenski plan",
                body: "Tranzicija koja štiti vrijednost tvrtke i kontinuitet poslovanja.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="border border-border bg-card p-5">
                <Icon className="w-5 h-5 text-primary mb-4" />
                <h2 className="text-xl font-heading text-foreground mb-2">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/valuate">
              <Button className="rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90">
                Procijeni spremnost tvrtke
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="rounded-none">
                Razgovarajmo o tranziciji
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
