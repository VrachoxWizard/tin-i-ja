import { Metadata } from "next";
import { FileCheck, Search, Shield, Target } from "lucide-react";
import { BuyerOnboardingForm } from "@/components/features/BuyerOnboardingForm";

export const metadata: Metadata = {
  title: "Kupite tvrtku | DealFlow",
  description:
    "Definirajte investicijske kriterije i pratite kvalificirana uparivanja, NDA statuse i deal room pristupe.",
  alternates: { canonical: "/buy" },
};

export default function BuyPage() {
  return (
    <div className="flex flex-col bg-background">
      <section className="relative border-b border-border bg-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(21,101,192,0.08),transparent_42%)]" />
        <div className="container relative mx-auto max-w-6xl px-4 pt-18 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              Portal za investitore
            </p>
            <h1>Registrirajte kriterije ulaganja i pratite podudaranja.</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Definirajte EV raspon, ciljane prihode, sektor i regiju. DealFlow
              zatim automatski izračunava podudaranja s novim aktivnim oglasima
              i vodi vas kroz NDA i deal room proces.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              {
                icon: Target,
                title: "Precizan profil",
                body: "EV, prihodi, industrija i regija postaju temelj match scorea.",
              },
              {
                icon: Search,
                title: "Kvalificirana uparivanja",
                body: "Sustav prati nove oglase i prikazuje najrelevantnije prilike.",
              },
              {
                icon: FileCheck,
                title: "Kontrolirani pristup",
                body: "NDA odobrenje otključava puni pregled tvrtke i dokumente.",
              },
              {
                icon: Shield,
                title: "Diskretno",
                body: "Identitet obje strane ostaje zaštićen do odgovarajuće faze procesa.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="border border-border bg-card p-5">
                <Icon className="w-5 h-5 text-primary mb-4" />
                <h2 className="text-xl font-heading text-foreground mb-2">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <BuyerOnboardingForm />
        </div>
      </section>
    </div>
  );
}
