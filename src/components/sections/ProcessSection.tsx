"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { SectionShell } from "@/components/shared/SectionShell";
import { processSteps } from "@/data/homepage";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function ProcessSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionShell spacing="none" className="py-24 md:py-40 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Header left side */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <p className="text-sm tracking-[0.2em] text-gold font-semibold uppercase mb-8 flex items-center gap-4">
              <span className="w-8 h-px bg-gold shadow-[0_0_10px_rgba(229,192,123,0.5)]" />
              Proces
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading text-white mb-8 leading-[1.05]">
              Kako funkcionira
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
              Četiri strukturirana koraka od inicijalne procjene do uspješne transakcije. Jasan, transparentan i siguran put.
            </p>
          </div>

          {/* Steps right side */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-12 md:space-y-24 relative">
              {/* Connecting vertical line */}
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-white/5" />

              {processSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    custom={i}
                    variants={prefersReducedMotion ? undefined : fadeUp}
                    initial={prefersReducedMotion ? undefined : "hidden"}
                    whileInView={prefersReducedMotion ? undefined : "visible"}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative flex gap-8 md:gap-12 group"
                  >
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="size-12 md:size-16 rounded-full bg-[#050A15] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-gold/50 transition-colors duration-500">
                        <Icon className="size-5 md:size-6 text-gold/70 group-hover:text-gold transition-colors duration-500" strokeWidth={2} />
                      </div>
                    </div>
                    
                    <div className="pt-2 md:pt-4">
                      <div className="text-gold text-xs font-bold tracking-[0.15em] uppercase mb-4">
                        Faza 0{i + 1}
                      </div>
                      <h3 className="font-heading text-2xl md:text-3xl text-white mb-4 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-slate-200 font-light leading-relaxed text-base md:text-lg">
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
