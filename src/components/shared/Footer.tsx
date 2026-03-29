"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Send } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-background pt-32 pb-8 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Section: CTA & Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-32">
          
          {/* Left: CTA */}
          <div className="lg:col-span-7">
            <h2 className="font-heading text-4xl md:text-6xl text-foreground mb-8 tracking-tighter leading-[1.05]">
              Diskretno povjerite <br />
              <span className="italic font-light text-muted-foreground pr-2">svoju transakciju</span> nama.
            </h2>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/valuate">
                <Button className="w-full sm:w-auto h-14 px-10 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-[0.75rem] font-bold tracking-[0.2em] uppercase transition-all duration-500">
                  Besplatna procjena
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-none bg-transparent border-white/10 text-foreground hover:bg-white/5 text-[0.75rem] font-bold tracking-[0.2em] uppercase transition-all duration-500">
                  Kontaktirajte nas
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Navigation Grid */}
          <div className="lg:col-span-4 lg:col-start-9 grid grid-cols-2 gap-12 pt-4">
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.2em] text-primary uppercase mb-8">Platforma</p>
              <ul className="space-y-4">
                <li><Link href="/sell" className="text-muted-foreground hover:text-foreground text-sm font-light transition-colors">Prodavatelji</Link></li>
                <li><Link href="/listings" className="text-muted-foreground hover:text-foreground text-sm font-light transition-colors">Investitori</Link></li>
                <li><Link href="/succession" className="text-muted-foreground hover:text-foreground text-sm font-light transition-colors">Nasljeđivanje</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[0.65rem] font-bold tracking-[0.2em] text-primary uppercase mb-8">Kontakt</p>
              <ul className="space-y-4">
                <li className="text-muted-foreground text-sm font-light">Zagreb, Hrvatska</li>
                <li><a href="mailto:info@dealflow.hr" className="text-muted-foreground hover:text-foreground text-sm font-light transition-colors">info@dealflow.hr</a></li>
                <li className="text-muted-foreground text-sm font-light">+385 1 234 5678</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Monumental Logo & Legals */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-20">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
             <div className="size-8 flex items-center justify-center border border-primary/30">
               <span className="font-heading text-primary text-[0.55rem] font-bold tracking-widest pl-[1px]">DF</span>
             </div>
             <span className="text-muted-foreground text-xs uppercase tracking-[0.15em] font-medium">© 2026 DealFlow Advisory</span>
          </div>

          <div className="flex gap-8">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-[0.15em] font-medium transition-colors">
              Privatnost
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-[0.15em] font-medium transition-colors">
              Uvjeti
            </Link>
          </div>
        </div>

        {/* Monumental Typography Background */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center overflow-hidden opacity-[0.02] pointer-events-none select-none z-0 translate-y-1/4">
          <span className="font-heading font-bold text-[20vw] leading-none tracking-tighter text-white whitespace-nowrap">
            DEALFLOW
          </span>
        </div>

      </div>
    </footer>
  );
}
