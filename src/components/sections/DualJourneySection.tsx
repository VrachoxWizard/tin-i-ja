import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/SectionShell";
import { sellerBenefits, buyerBenefits } from "@/data/homepage";
import { ArrowRight, Check } from "lucide-react";

export function DualJourneySection() {
  return (
    <SectionShell spacing="none" className="py-24 md:py-32">
      <div className="text-center mb-20 px-4">
        <p className="text-sm tracking-[0.2em] text-gold font-semibold uppercase mb-6 flex items-center justify-center gap-4">
          <span className="w-8 h-px bg-gold" />
          Dva puta, jedan cilj
          <span className="w-8 h-px bg-gold" />
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white tracking-tight">
          Prodajete ili kupujete?
        </h2>
      </div>

      {/* Edge-to-edge container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Seller Panel */}
          <div className="relative group rounded-2xl overflow-hidden bg-[#0A1220] border border-white/5 transition-all duration-700 hover:border-gold/30">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 p-10 md:p-14 h-full flex flex-col">
              <div className="mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full border border-gold/40 text-gold text-xs font-bold tracking-[0.15em] uppercase mb-8">
                  Za Prodavatelje
                </span>
                <h3 className="font-heading text-3xl md:text-4xl leading-[1.1] text-white mb-6">
                  Prodajte svoju tvrtku diskretno i po pravoj tržišnoj vrijednosti.
                </h3>
                <p className="text-slate-200 font-light leading-relaxed">
                  Maksimizirajte svoj izlaz. Povezujemo vas isključivo s verificiranim, ozbiljnim investitorima uz 100% anonimnost i NDA zaštitu.
                </p>
              </div>

              <ul className="space-y-5 mb-16 flex-1">
                {sellerBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-4 text-slate-300 font-light"
                  >
                    <div className="mt-1 size-5 rounded-full border border-gold/30 flex items-center justify-center shrink-0">
                      <Check className="size-3 text-gold" strokeWidth={2} />
                    </div>
                    <span className="leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/valuate" className="mt-auto">
                <Button className="w-full sm:w-auto h-14 bg-white text-background hover:bg-gold hover:text-white rounded-full px-8 text-sm font-bold tracking-[0.1em] uppercase transition-all duration-500">
                  Procijeni vrijednost
                </Button>
              </Link>
            </div>
          </div>

          {/* Buyer Panel */}
          <div className="relative group rounded-2xl overflow-hidden bg-[#0A1220] border border-white/5 transition-all duration-700 hover:border-trust/30">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-trust/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 p-10 md:p-14 h-full flex flex-col">
              <div className="mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full border border-trust/40 text-blue-400 text-xs font-bold tracking-[0.15em] uppercase mb-8">
                  Za Investitore
                </span>
                <h3 className="font-heading text-3xl md:text-4xl leading-[1.1] text-white mb-6">
                  Pristupite verificiranim akvizicijskim prilikama u regiji.
                </h3>
                <p className="text-slate-200 font-light leading-relaxed">
                  Skenirajte tržište s preciznošću. Standardizirani financijski podatci i direktan kontakt s umreženim vlasnicima.
                </p>
              </div>

              <ul className="space-y-5 mb-16 flex-1">
                {buyerBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-4 text-slate-300 font-light"
                  >
                    <div className="mt-1 size-5 rounded-full border border-trust/30 flex items-center justify-center shrink-0">
                      <Check className="size-3 text-blue-400" strokeWidth={2} />
                    </div>
                    <span className="leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/listings" className="mt-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-14 bg-transparent border-white/20 text-white hover:bg-white hover:text-background rounded-full px-8 text-sm font-bold tracking-[0.1em] uppercase transition-all duration-500"
                >
                  Pregledaj prilike
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </SectionShell>
  );
}
