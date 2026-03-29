"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  BarChart3,
  FileSignature,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const motionProps = (i: number) =>
    prefersReducedMotion
      ? {}
      : { variants: fadeUp, initial: "hidden", animate: "visible", custom: i };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950 w-full">
      {/* Subtle static background — no animated orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(37,99,235,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(212,175,55,0.04),transparent_60%)]" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div {...motionProps(0)} className="mb-8">
            <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-sm font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-trust" />
              Premium M&A platforma za Hrvatsku
            </span>
          </motion.div>

          {/* Headline — sharp, grammatically correct */}
          <motion.h1
            {...motionProps(1)}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading font-extrabold tracking-[-0.03em] text-white mb-8 leading-[1.05]"
          >
            Osigurajte pravu{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gold via-yellow-200 to-gold">
              budućnost
            </span>
            <br className="hidden md:block" /> vaše tvrtke.
          </motion.h1>

          {/* Subheadline — clean, jargon-free */}
          <motion.p
            {...motionProps(2)}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl leading-relaxed"
          >
            Spajamo vlasnike tvrtki s kvalificiranim investitorima. Diskretna
            procjena, anonimni profili i sigurno pregovaranje — sve na jednom
            mjestu.
          </motion.p>

          {/* CTAs — strategically ordered */}
          <motion.div
            {...motionProps(3)}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link href="/valuate">
              <Button className="h-14 bg-gold text-slate-950 hover:bg-gold/90 rounded-full font-heading px-8 text-base font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300 flex items-center gap-2">
                Besplatna procjena
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <Link href="/listings">
              <Button
                variant="outline"
                className="h-14 bg-transparent border border-white/10 text-white hover:bg-white/[0.06] hover:border-white/20 rounded-full font-heading px-8 text-base font-medium transition-all duration-300"
              >
                Istraži prilike
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges — proper icons, no emojis */}
          <motion.div
            {...motionProps(4)}
            className="flex flex-wrap items-center gap-6 mt-12"
          >
            {[
              { icon: ShieldCheck, text: "GDPR usklađenost" },
              { icon: BarChart3, text: "AI-Powered" },
              { icon: FileSignature, text: "NDA zaštita" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={text} className="flex items-center gap-2">
                {i > 0 && <span className="w-px h-3 bg-white/10 -ml-3 mr-0" />}
                <Icon className="size-3.5 text-slate-500" aria-hidden="true" />
                <span className="text-slate-500 text-xs uppercase tracking-widest font-sans">
                  {text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
