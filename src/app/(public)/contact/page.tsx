import { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktirajte DealFlow tim za pitanja o prodaji ili kupnji tvrtke u Hrvatskoj.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-background">
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="container relative z-10 mx-auto px-4 max-w-4xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-4 px-4 py-1.5 border border-white/10 text-muted-foreground text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-12">
              <span className="w-1.5 h-1.5 bg-primary" />
              Kontakt
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-foreground mb-8 leading-[1.05] tracking-tighter">
              Razgovarajmo o{" "}
              <span className="italic font-light text-muted-foreground">
                vašem poslu
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed tracking-wide font-light">
              Naš tim stoji vam na raspolaganju za sva pitanja vezana uz kupnju,
              prodaju ili procjenu vrijednosti tvrtke.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 p-px">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "info@dealflow.hr",
                href: "mailto:info@dealflow.hr",
              },
              {
                icon: Phone,
                label: "Telefon",
                value: "+385 1 234 5678",
                href: "tel:+38512345678",
              },
              {
                icon: MapPin,
                label: "Lokacija",
                value: "Zagreb, Hrvatska",
                href: null,
              },
            ].map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-4 px-6 py-14 bg-card group transition-colors hover:bg-card/80"
              >
                <Icon
                  className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-500"
                  strokeWidth={1}
                />
                <span className="text-[0.6rem] text-primary font-bold tracking-widest uppercase">
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    className="text-sm text-foreground font-light tracking-wide hover:text-primary transition-colors"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="text-sm text-foreground font-light tracking-wide">
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 border border-white/5 bg-card">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Za diskretne upite vezane uz M&A transakcije, obratite nam se
              putem emaila. Sva komunikacija je strogo povjerljiva i zaštićena
              NDA ugovorima.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
