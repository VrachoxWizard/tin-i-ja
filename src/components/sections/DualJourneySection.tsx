import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/SectionShell";
import { sellerBenefits, buyerBenefits } from "@/data/homepage";
import { ArrowRight, Check } from "lucide-react";

export function DualJourneySection() {
  return (
    <SectionShell spacing="default">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-sans mb-4">
          Dva puta, jedan cilj
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight">
          Prodajete ili kupujete?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Seller Column */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-10 hover:border-gold/20 transition-colors duration-300">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-wide mb-6">
            Za Prodavatelje
          </div>
          <h3 className="font-heading text-2xl font-semibold text-white mb-4 tracking-tight">
            Prodajte svoju tvrtku diskretno i po pravoj tržišnoj vrijednosti.
          </h3>
          <ul className="space-y-3 mb-8">
            {sellerBenefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed"
              >
                <Check
                  className="size-4 text-gold shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                {benefit}
              </li>
            ))}
          </ul>
          <Link href="/valuate">
            <Button className="h-11 bg-gold text-slate-950 hover:bg-gold/90 rounded-full font-heading px-6 text-sm font-bold transition-all duration-300 flex items-center gap-2">
              Procijeni vrijednost
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        {/* Buyer Column */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-10 hover:border-trust/20 transition-colors duration-300">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trust/10 text-blue-400 text-xs font-semibold tracking-wide mb-6">
            Za Investitore
          </div>
          <h3 className="font-heading text-2xl font-semibold text-white mb-4 tracking-tight">
            Pristupite verificiranim akvizicijskim prilikama u Hrvatskoj.
          </h3>
          <ul className="space-y-3 mb-8">
            {buyerBenefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed"
              >
                <Check
                  className="size-4 text-blue-400 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                {benefit}
              </li>
            ))}
          </ul>
          <Link href="/listings">
            <Button
              variant="secondary"
              className="h-11 bg-trust text-white hover:bg-trust/90 rounded-full font-heading px-6 text-sm font-bold transition-all duration-300 flex items-center gap-2"
            >
              Pregledaj prilike
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
