"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.0,
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
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-background w-full">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_background_1774797313751.png"
          alt="Premium Architecture"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center opacity-30"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent md:w-3/4" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div {...motionProps(0)} className="mb-10">
            <span className="inline-flex items-center gap-4 text-gold text-xs font-semibold tracking-[0.2em] uppercase">
              <span className="w-10 h-px bg-gold shadow-[0_0_10px_rgba(229,192,123,0.5)]" />
              Institucionalno M&A Savjetovanje
            </span>
          </motion.div>

          {/* Headline - Editorial Serif */}
          <motion.h1
            {...motionProps(1)}
            className="text-5xl md:text-6xl lg:text-[5.5rem] font-heading text-white mb-8 leading-[1.1]"
          >
            Maksimizirajte <br />
            <span className="text-white/70 italic font-light leading-[1.15]">vrijednost</span> vašeg poslovanja.
          </motion.h1>

          {/* Subheadline - Clean Sans */}
          <motion.p
            {...motionProps(2)}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-xl leading-relaxed font-light"
          >
            Ekskluzivna platforma koja diskretno povezuje vlasnike tvrtki s provjerenim investitorima na hrvatskom tržištu.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...motionProps(3)}
            className="flex flex-col sm:flex-row items-center gap-5"
          >
            <Link href="/valuate" className="w-full sm:w-auto">
              <Button className="w-full h-14 bg-gold text-background hover:bg-white rounded-full px-10 text-sm font-bold tracking-[0.15em] uppercase transition-all duration-500 shadow-[0_0_20px_rgba(229,192,123,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]">
                Besplatna procjena
              </Button>
            </Link>

            <Link href="/listings" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full h-14 bg-transparent border-white/20 text-white hover:bg-white/5 hover:border-white/40 rounded-full px-10 text-sm font-medium tracking-[0.1em] uppercase transition-all duration-500"
              >
                Istraži prilike
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
