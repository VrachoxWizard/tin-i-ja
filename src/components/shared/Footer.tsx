"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-border/20 bg-card-elevated/40 backdrop-blur-xl overflow-hidden mt-auto">
      {/* ── BACKGROUND GLOWS ────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Main Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <Logo />
              <div>
                <p className="font-heading text-lg text-foreground tracking-widest uppercase font-bold">DealFlow</p>
              </div>
            </div>

            <h2 className="font-heading text-3xl text-foreground tracking-tight max-w-lg leading-tight">
              Ekskluzivni ekosustav za prijenos kapitala.
            </h2>
            <p className="text-muted-foreground/80 max-w-md leading-relaxed text-sm">
              Potpuna privatnost, AI procjena visoke točnosti i rigorozan proces verifikacije ulagača u zatvorenoj arhitekturi.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link href="/valuate">
                <Button className="h-12 px-8 rounded-none border border-primary/50 btn-shimmer bg-card-elevated/80 text-foreground text-xs uppercase tracking-[0.18em] shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-glow-gold transition-all duration-500">
                  Zatraži procjenu
                  <ArrowRight className="w-3.5 h-3.5 ml-3" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Platform Nav */}
          <div className="lg:pl-8">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-8">
              Platforma
            </p>
            <div className="space-y-4">
              {[
                { href: "/sell", label: "Prodajem tvrtku" },
                { href: "/buy", label: "Kupujem tvrtku" },
                { href: "/listings", label: "Marketplace" },
                { href: "/succession", label: "Nasljeđivanje" }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors w-fit relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-primary/50 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold mb-8">
              Sjedište
            </p>
            <div className="space-y-5 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
                <p className="leading-relaxed">Zagreb, Hrvatska<br />Strogo povjerljivi sastanci po dogovoru.</p>
              </div>

              <Link href="/contact" className="inline-flex items-center text-primary/90 hover:text-primary transition-colors text-xs uppercase tracking-widest font-semibold mt-4">
                Uspostavite kontakt
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 border-t border-border/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/60">
            © {new Date().getFullYear()} DealFlow — M&A Architecture. Sva prava pridržana.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground transition-colors">
              Pravila Privatnosti
            </Link>
            <Link href="/terms" className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground transition-colors">
              Uvjeti Korisnika
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
