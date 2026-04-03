import { Metadata } from "next";
import { Bot, EyeOff, Handshake, ShieldCheck } from "lucide-react";
import { SellerOnboardingForm } from "@/components/features/SellerOnboardingForm";

export const metadata: Metadata = {
  title: "Prodajte tvrtku | DealFlow",
  description:
    "Diskretno pokrenite prodajni proces uz AI generirani blind teaser, internu procjenu i kontroliranu objavu oglasa.",
  alternates: { canonical: "/sell" },
};

export default function SellPage() {
  return (
    <div className="flex flex-col bg-background">
      <section className="relative border-b border-border bg-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(21,101,192,0.08),transparent_42%)]" />
        <div className="container relative mx-auto max-w-6xl px-4 pt-18 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              Portal za prodavatelje
            </p>
            <h1>Započnite prodajni proces bez javnog izlaganja tvrtke.</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Interni podaci ostaju skriveni. Sustav generira anonimni teaser,
              vi ga pregledavate, a tek nakon potvrde objavljujete priliku u
              marketplaceu.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Povjerljivo",
                body: "Naziv tvrtke i osjetljivi detalji ostaju interni.",
              },
              {
                icon: Bot,
                title: "AI teaser",
                body: "Automatski generiran anonimizirani pregled za kupce.",
              },
              {
                icon: EyeOff,
                title: "Seller review",
                body: "Objava tek nakon vaše potvrde i kontrole sadržaja.",
              },
              {
                icon: Handshake,
                title: "NDA workflow",
                body: "Pun identitet i dokumenti otključavaju se tek nakon odobrenja.",
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
        <div className="container mx-auto px-4 max-w-3xl">
          <SellerOnboardingForm />
        </div>
      </section>
    </div>
  );
}
