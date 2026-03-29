"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

const slowExposure: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 1.8,
      delay: i * 0.2,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const motionProps = (i: number) =>
    prefersReducedMotion
      ? {}
      : { variants: slowExposure, initial: "hidden", animate: "visible", custom: i };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background w-full">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_background_1774797313751.png"
          alt="Premium Architecture"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center opacity-40 mix-blend-luminosity scale-105"
          quality={90}
        />
        {/* Gradients to create atmospheric vignette and shadow play */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/60 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent w-full md:w-4/5 lg:w-2/3 z-10" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 md:pt-32 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 xl:col-span-7 flex flex-col justify-center">
            {/* Eyebrow */}
            <motion.div {...motionProps(0)} className="mb-12">
              <div className="inline-flex items-center gap-4 text-primary text-[0.7rem] font-medium tracking-[0.25em] uppercase">
                <span className="w-12 h-[1px] bg-primary/70" />
                Institucionalno M&A Savjetovanje
              </div>
            </motion.div>

            {/* Headline - Editorial Serif */}
            <motion.h1
              {...motionProps(1)}
              className="text-4xl md:text-6xl lg:text-7xl font-heading text-foreground mb-8 leading-[1.05] tracking-tighter"
            >
              Maksimizirajte <br />
              <span className="text-muted-foreground italic font-light pr-2">vrijednost</span> vašeg poslovanja.
            </motion.h1>

            {/* Subheadline - Clean Sans */}
            <motion.p
              {...motionProps(2)}
              className="text-lg md:text-xl text-muted-foreground mb-14 max-w-xl leading-relaxed font-light tracking-wide"
            >
              Ekskluzivna platforma koja diskretno povezuje vlasnike tvrtki s dokapitaliziranim investitorima na hrvatskom tržištu. Nema kompromisa.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...motionProps(3)}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link href="/valuate" className="w-full sm:w-auto">
                <Button className="w-full h-12 md:h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-10 text-[0.8rem] font-medium tracking-[0.2em] uppercase transition-all duration-300">
                  Besplatna procjena
                </Button>
              </Link>

              <Link href="/listings" className="w-full sm:w-auto group">
                <Button
                  variant="outline"
                  className="w-full h-12 md:h-14 bg-surface-glass backdrop-blur-md border-border text-foreground hover:bg-white/5 hover:border-muted-foreground/40 rounded-none px-10 text-[0.8rem] font-medium tracking-[0.2em] uppercase transition-all duration-300"
                >
                  Istraži prilike
                  <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
