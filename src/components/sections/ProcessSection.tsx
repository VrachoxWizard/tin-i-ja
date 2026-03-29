"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { SectionShell } from "@/components/shared/SectionShell";
import { processSteps } from "@/data/homepage";

const accentStyles = {
  trust: {
    bg: "bg-trust/10",
    border: "border-trust/20",
    text: "text-blue-400",
  },
  gold: {
    bg: "bg-gold/10",
    border: "border-gold/20",
    text: "text-gold",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-300",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-300",
  },
} as const;

function ProcessLine() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      ref={ref}
      className="absolute top-7 left-[12.5%] w-[75%] h-0.5 hidden md:block z-0"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="processGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(37,99,235,0.4)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0.4)" />
        </linearGradient>
      </defs>
      <motion.line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke="url(#processGrad)"
        strokeWidth="1"
        initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }
        }
      />
    </svg>
  );
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function ProcessSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionShell spacing="default">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-sans mb-4">
          Proces
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-5 tracking-tight">
          Kako funkcionira
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Četiri koraka od procjene do uspješne transakcije.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <ProcessLine />

        {/* Mobile vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-trust/20 to-gold/20 md:hidden z-0"
          aria-hidden="true"
        />

        <motion.div
          variants={prefersReducedMotion ? undefined : stagger}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative z-10"
        >
          {processSteps.map((step, i) => {
            const a = accentStyles[step.accent];

            return (
              <motion.div
                key={step.title}
                variants={prefersReducedMotion ? undefined : fadeUp}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-5">
                  <div
                    className={`size-14 rounded-xl ${a.bg} ${a.border} border ${a.text} flex items-center justify-center`}
                  >
                    <step.icon className="size-6" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-slate-950 border border-white/20 text-white text-[10px] font-bold flex items-center justify-center font-heading">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-1.5 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[180px]">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SectionShell>
  );
}
