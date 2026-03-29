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
          className="object-cover object-center opacity-[0.05] mix-blend-luminosity grayscale scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/90" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[0.7rem] tracking-[0.25em] text-primary font-medium uppercase mb-10 flex items-center justify-center gap-4">
            <span className="w-12 h-[1px] bg-primary/70" />
            Zatvorite transakciju
            <span className="w-12 h-[1px] bg-primary/70" />
          </p>
          <h2 className="font-heading text-5xl md:text-7xl lg:text-[7rem] text-foreground mb-10 leading-[1.0] tracking-tighter">
            Sljedeći korak je <br />
            <span className="text-muted-foreground italic font-light pr-2">na vama.</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl mb-16 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
            Registrirajte se i pristupite ekskluzivnoj bazi provjerenih tvrtki i dokapitaliziranih investitora u regiji. Nema kompromisa.
          </p>

          <Link href="/register">
            <Button className="h-16 px-14 text-[0.8rem] rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-[0.2em] uppercase transition-all duration-500">
              Pridružite se besplatno
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
