import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative py-32 md:py-48 overflow-hidden z-10 w-full flex items-center justify-center bg-background border-t border-white/5">
      {/* Background image overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2500&auto=format&fit=crop"
          alt="Premium Space"
          fill
          className="object-cover object-center opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm tracking-[0.2em] text-gold font-semibold uppercase mb-10 flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-gold shadow-[0_0_10px_rgba(229,192,123,0.5)]" />
            Zatvorite transakciju
            <span className="w-8 h-px bg-gold shadow-[0_0_10px_rgba(229,192,123,0.5)]" />
          </p>
          <h2 className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] text-white mb-10 leading-[1.05]">
            Sljedeći korak je <br />
            <span className="text-white/70 italic font-light">na vama.</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl mb-16 max-w-2xl mx-auto font-light leading-relaxed">
            Registrirajte se i pristupite ekskluzivnoj bazi provjerenih tvrtki i ozbiljnih investitora u regiji.
          </p>

          <Link href="/register">
            <Button className="h-14 md:h-16 px-10 md:px-14 text-sm md:text-base rounded-sm bg-gold text-background hover:bg-white font-bold tracking-[0.15em] uppercase shadow-[0_0_30px_rgba(229,192,123,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] transition-all duration-500">
              Pridružite se besplatno
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
