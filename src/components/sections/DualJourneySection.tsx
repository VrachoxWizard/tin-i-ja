import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/SectionShell";
import { sellerBenefits, buyerBenefits } from "@/data/homepage";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";

export function DualJourneySection() {
  return (
    <section className="w-full bg-background pt-24 pb-0 md:pt-32">
      <div className="text-center mb-16 md:mb-24 px-4 max-w-4xl mx-auto">
        <p className="text-[0.7rem] tracking-[0.25em] text-primary font-medium uppercase mb-6 flex items-center justify-center gap-4">
          <span className="w-12 h-[1px] bg-primary/70" />
          Dva puta, jedan cilj
          <span className="w-12 h-[1px] bg-primary/70" />
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-foreground tracking-tighter leading-[1.1]">
          Prodajete ili <span className="italic font-light text-muted-foreground pr-2">kupujete?</span>
        </h2>
      </div>

      {/* Edge-to-edge Split Door Container */}
      <div className="flex flex-col lg:flex-row w-full min-h-[85vh] group/container border-y border-white/5">
        
        {/* Seller Panel */}
        <div className="relative flex-1 bg-card overflow-hidden transition-all duration-700 ease-out group/panel border-b lg:border-b-0 lg:border-r border-white/5 lg:group-hover/container:[&:not(:hover)]:opacity-40">
          <div className="absolute inset-0 transition-opacity duration-1000 opacity-30 group-hover/panel:opacity-100">
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
             <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background/50 to-transparent z-10" />
          </div>
          
          <div className="relative z-20 p-6 md:p-12 lg:p-20 h-full flex flex-col justify-end">
            <div className="mb-12">
              <span className="inline-block px-4 py-1.5 rounded-none border border-primary/40 text-primary text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-8 bg-background/50 backdrop-blur-md">
                Za Prodavatelje
              </span>
              <h3 className="font-heading text-3xl md:text-5xl leading-[1.05] text-foreground mb-6 tracking-tighter">
                Prodajte svoju tvrtku diskretno i po pravoj <span className="italic font-light">tržišnoj vrijednosti</span>.
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-md text-lg">
                Maksimizirajte svoj izlaz. Povezujemo vas isključivo s verificiranim, ozbiljnim investitorima uz 100% anonimnost i NDA zaštitu.
              </p>
            </div>

            <div>
              <ul className="space-y-4 mb-12">
                {sellerBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-4 text-slate-300 font-light text-sm md:text-base">
                    <div className="mt-1 size-1.5 rounded-full bg-primary/70 shrink-0" />
                    <span className="leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/valuate">
                <Button className="h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 text-[0.75rem] font-bold tracking-[0.2em] uppercase transition-all duration-500">
                  Procijeni vrijednost
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Buyer Panel */}
        <div className="relative flex-1 bg-card overflow-hidden transition-all duration-700 ease-out group/panel lg:group-hover/container:[&:not(:hover)]:opacity-40">
          <div className="absolute inset-0 transition-opacity duration-1000 opacity-30 group-hover/panel:opacity-100">
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
             <div className="absolute inset-0 bg-gradient-to-l from-secondary/10 via-background/50 to-transparent z-10" />
          </div>
          
          <div className="relative z-20 p-6 md:p-12 lg:p-20 h-full flex flex-col justify-end">
            <div className="mb-12">
              <span className="inline-block px-4 py-1.5 rounded-none border border-secondary/40 text-secondary-foreground text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-8 bg-background/50 backdrop-blur-md">
                Za Investitore
              </span>
              <h3 className="font-heading text-3xl md:text-5xl leading-[1.05] text-foreground mb-6 tracking-tighter">
                Pristupite verificiranim <span className="italic font-light text-muted-foreground pr-2">akvizicijskim prilikama</span> u regiji.
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-md text-lg">
                Skenirajte tržište s preciznošću. Standardizirani financijski podatci i direktan kontakt s umreženim vlasnicima.
              </p>
            </div>

            <div>
              <ul className="space-y-4 mb-12">
                {buyerBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-4 text-slate-300 font-light text-sm md:text-base">
                    <div className="mt-1 size-1.5 rounded-full bg-secondary/70 shrink-0" />
                    <span className="leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/listings" className="group/btn">
                <Button
                  variant="outline"
                  className="h-14 bg-surface-glass backdrop-blur-md border-border text-foreground hover:bg-white/5 hover:border-muted-foreground/40 rounded-none px-8 text-[0.75rem] font-bold tracking-[0.2em] uppercase transition-all duration-500"
                >
                  Pregledaj prilike
                  <span className="ml-3 transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
