import { Metadata } from "next";
import { Mail, MapPin, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt | DealFlow",
  description:
    "Kontaktirajte DealFlow tim za diskretne upite o prodaji, kupnji ili procjeni vrijednosti tvrtke u Hrvatskoj.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-background">
      <section className="relative border-b border-border bg-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(21,101,192,0.08),transparent_42%)]" />
        <div className="container relative mx-auto max-w-6xl px-4 pt-18 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              Kontakt
            </p>
            <h1>Razgovarajmo o vašem sljedećem koraku.</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Za diskretne upite vezane uz prodaju, kupnju, valuaciju ili
              planiranje tranzicije, javite nam se izravno. Komunikacija je
              povjerljiva i strukturirana za osjetljive poslovne procese.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "info@dealflow.hr",
                href: "mailto:info@dealflow.hr",
              },
              {
                icon: MapPin,
                label: "Lokacija",
                value: "Zagreb, Hrvatska",
                href: null,
              },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="border border-border bg-card p-6">
                <Icon className="w-5 h-5 text-primary mb-4" />
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  {label}
                </p>
                {href ? (
                  <a href={href} className="text-foreground hover:text-primary">
                    {value}
                  </a>
                ) : (
                  <p className="text-foreground">{value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 border border-border bg-card p-5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Za osjetljive M&A procese preporučujemo prvi kontakt emailom kako
              bismo mogli strukturirati sljedeći korak i razinu povjerljivosti.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
