"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionShell } from "@/components/shared/SectionShell";
import { features } from "@/data/homepage";

const accentStyles = {
  trust: {
    iconBg: "bg-trust/10",
    iconBorder: "border-trust/20",
    iconText: "text-blue-400",
    hoverBorder: "hover:border-trust/20",
  },
  gold: {
    iconBg: "bg-gold/10",
    iconBorder: "border-gold/20",
    iconText: "text-gold",
    hoverBorder: "hover:border-gold/20",
  },
  indigo: {
    iconBg: "bg-indigo-500/10",
    iconBorder: "border-indigo-500/20",
    iconText: "text-indigo-300",
    hoverBorder: "hover:border-indigo-500/20",
  },
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    iconText: "text-emerald-300",
    hoverBorder: "hover:border-emerald-500/20",
  },
} as const;

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function FeaturesBento() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionShell spacing="emphasis">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-sans mb-4">
          Platforma
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-5 tracking-tight leading-tight">
          Institucionalna kvaliteta. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-trust via-blue-400 to-indigo-300">
            Tehnološka preciznost.
          </span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Sigurni procesi, pametni algoritmi i stroga pravila privatnosti za
          optimalan ishod svake transakcije.
        </p>
      </div>

      <motion.div
        variants={prefersReducedMotion ? undefined : staggerContainer}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-5"
      >
        {features.map((feature) => {
          const a = accentStyles[feature.accent];
          const Icon = feature.icon;

          const gridClass =
            feature.size === "large"
              ? "md:col-span-2 md:row-span-1"
              : feature.size === "tall"
                ? "md:col-span-1 md:row-span-2"
                : "md:col-span-1 md:row-span-1";

          return (
            <motion.div
              key={feature.title}
              variants={prefersReducedMotion ? undefined : fadeUp}
              className={`${gridClass} border border-white/[0.06] rounded-2xl p-8 md:p-10 ${a.hoverBorder} hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group flex flex-col`}
            >
              {/* Subtle hover glow — no animated orbs */}
              <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col h-full">
                <div
                  className={`size-12 rounded-xl ${a.iconBg} ${a.iconBorder} border ${a.iconText} flex items-center justify-center mb-5`}
                >
                  <Icon className="size-5" />
                </div>

                {feature.size === "tall" && <div className="flex-1" />}

                <h3 className="font-heading text-xl md:text-2xl font-semibold text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionShell>
  );
}
