"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { SectionShell } from "@/components/shared/SectionShell";
import { features } from "@/data/homepage";

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function FeaturesBento() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionShell spacing="none" className="py-24 md:py-40 bg-[#02040A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-20 md:mb-32 max-w-3xl">
          <p className="text-sm tracking-[0.2em] text-gold font-semibold uppercase mb-8 flex items-center gap-4">
            <span className="w-8 h-px bg-gold shadow-[0_0_10px_rgba(229,192,123,0.5)]" />
            Platforma
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading text-white mb-8 leading-[1.05]">
            Institucionalna kvaliteta. <br />
            <span className="text-white/60 italic font-light">
              Tehnološka preciznost.
            </span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
            Sigurni procesi, pametni algoritmi i stroga pravila privatnosti za
            optimalan ishod svake transakcije.
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <motion.div
          variants={prefersReducedMotion ? undefined : staggerContainer}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            
            // Generate an asymmetric layout based on index
            let gridClasses = "md:col-span-4";
            if (idx === 0) gridClasses = "md:col-span-8";
            
            return (
              <motion.div
                key={feature.title}
                variants={prefersReducedMotion ? undefined : fadeUp}
                className={`${gridClasses} bg-background p-10 md:p-14 hover:bg-[#050A15] transition-colors duration-700 group flex flex-col justify-between min-h-[320px]`}
              >
                <div>
                  <div className="mb-8">
                    <Icon className="size-6 text-gold/70 group-hover:text-gold transition-colors duration-500" strokeWidth={2} />
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl text-white mb-4 leading-tight">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-200 font-light leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}

          {/* Decorative Media Fill for the remaining 4 columns */}
          <motion.div
            variants={prefersReducedMotion ? undefined : fadeUp}
            className="md:col-span-4 relative bg-[#050A15] p-0 min-h-[320px] overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent z-10" />
            <img 
              src="/images/m_and_a_carousel_1_1774797397476.png" 
              alt="DealFlow Premium Architecture"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-700 mix-blend-luminosity"
            />
            <div className="absolute inset-0 border border-white/5" />
          </motion.div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
