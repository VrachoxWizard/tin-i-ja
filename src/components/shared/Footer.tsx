"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/70">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              DealFlow
            </p>
            <h2 className="font-heading text-3xl text-foreground tracking-tight max-w-xl">
              Diskretan proces za prodaju, kupnju i prijenos vlasništva.
            </h2>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              AI procjena, anonimni teaseri, strukturirani NDA workflow i sigurni
              deal room za hrvatsko tržište privatnih tvrtki.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/valuate">
                <Button className="rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90">
                  Procijeni vrijednost
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="rounded-none">
                  Kontaktirajte nas
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-5">
              Platforma
            </p>
            <div className="space-y-3 text-sm">
              <Link href="/sell" className="block text-muted-foreground hover:text-foreground">
                Prodajem tvrtku
              </Link>
              <Link href="/buy" className="block text-muted-foreground hover:text-foreground">
                Kupujem tvrtku
              </Link>
              <Link href="/listings" className="block text-muted-foreground hover:text-foreground">
                Marketplace
              </Link>
              <Link
                href="/succession"
                className="block text-muted-foreground hover:text-foreground"
              >
                Nasljeđivanje
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-5">
              Kontakt
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Zagreb, Hrvatska</p>
              <a href="mailto:info@dealflow.hr" className="block hover:text-foreground">
                info@dealflow.hr
              </a>
              <a href="tel:+38512345678" className="block hover:text-foreground">
                +385 1 234 5678
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col md:flex-row justify-between gap-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <p>© 2026 DealFlow</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground">
              Privatnost
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Uvjeti
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
