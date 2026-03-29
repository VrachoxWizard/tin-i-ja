import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden z-10 w-full flex items-center justify-center">
      {/* Subtle background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-80 bg-linear-to-r from-trust/[0.06] to-gold/[0.06] blur-[100px] opacity-60" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
            Sljedeći korak je{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gold to-yellow-200">
              na vama.
            </span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
            Registrirajte se i pridružite se mreži tvrtki i investitora na
            hrvatskom tržištu.
          </p>

          <Link href="/register">
            <Button className="h-16 px-12 text-lg rounded-full bg-white text-slate-950 hover:bg-slate-100 font-heading font-bold shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-300">
              Registrirajte se besplatno
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
