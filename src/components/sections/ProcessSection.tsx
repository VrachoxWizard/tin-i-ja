"use client";

import { motion, useReducedMotion, Variants, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionShell } from "@/components/shared/SectionShell";
import { processSteps } from "@/data/homepage";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function ProcessSection() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <SectionShell spacing="none" className="py-24 md:py-40 bg-background relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Header left side */}
          <div className="lg:col-span-5 lg:sticky lg:top-40 self-start">
            <p className="text-[0.7rem] tracking-[0.25em] text-primary font-medium uppercase mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-primary/70" />
              Proces
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-foreground mb-8 leading-[1.05] tracking-tighter">
              Kako to <span className="italic font-light text-muted-foreground">funkcionira</span>.
            </h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed tracking-wide">
              Četiri strukturirana koraka od inicijalne evaluacije do uspješne transakcije. Jasan, transparentan i diskretan put.
            </p>
          </div>

          {/* Steps right side */}
          <div className="lg:col-span-7" ref={containerRef}>
            <div className="space-y-16 md:space-y-32 relative">
              {/* Connecting vertical line (Background) */}
              <div className="absolute left-6 md:left-8 top-4 bottom-4 w-px bg-white/5" />
              
              {/* Connecting vertical line (Illuminated) */}
              {!prefersReducedMotion && (
                <motion.div 
                  className="absolute left-6 md:left-8 top-4 bottom-4 w-px bg-primary origin-top shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  style={{ scaleY }}
                />
              )}

              {processSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    custom={i}
                    variants={prefersReducedMotion ? undefined : fadeUp}
                    initial={prefersReducedMotion ? undefined : "hidden"}
                    whileInView={prefersReducedMotion ? undefined : "visible"}
                    viewport={{ once: true, margin: "-150px" }}
                    className="relative flex gap-8 md:gap-12 group"
                  >
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="size-12 md:size-16 rounded-full bg-card border border-white/5 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-all duration-700 shadow-xl">
                        <Icon className="size-5 md:size-6 text-muted-foreground group-hover:text-primary transition-colors duration-700" strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    <div className="pt-2 md:pt-4">
                      <div className="text-primary/70 text-[0.65rem] font-bold tracking-[0.25em] uppercase mb-4">
                        Faza 0{i + 1}
                      </div>
                      <h3 className="font-heading text-2xl md:text-4xl text-foreground mb-4 leading-tight tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground font-light leading-relaxed text-base md:text-lg">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
