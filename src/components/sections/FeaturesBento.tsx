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
          <p className="text-[0.7rem] tracking-[0.25em] text-primary font-medium uppercase mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-primary/70" />
            Trezor
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading text-foreground mb-8 leading-[1.05] tracking-tighter">
            Institucionalna kvaliteta. <br />
            <span className="text-muted-foreground italic font-light pr-2">
              Tehnološka preciznost.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed max-w-2xl tracking-wide">
            Sigurni procesi, enkriptirani podaci i stroga pravila privatnosti za
            optimalan ishod svake transakcije.
          </p>
        </div>

        {/* The Vault Grid */}
        <motion.div
          variants={prefersReducedMotion ? undefined : staggerContainer}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "visible"}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/10 border border-white/10 rounded-sm overflow-hidden p-px"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            
            // Asymmetric layout
            let gridClasses = "md:col-span-4";
            if (idx === 0) gridClasses = "md:col-span-8";
            
            return (
              <motion.div
                key={feature.title}
                variants={prefersReducedMotion ? undefined : fadeUp}
                className={`${gridClasses} bg-card p-10 md:p-14 hover:bg-card/80 transition-colors duration-1000 group flex flex-col justify-between min-h-[320px]`}
              >
                <div>
                  <div className="mb-8">
                    <Icon className="size-6 text-muted-foreground group-hover:text-primary transition-colors duration-1000" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-2xl md:text-4xl text-foreground mb-4 leading-tight tracking-tight">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground font-light leading-relaxed tracking-wide">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}

          {/* Decorative Media Fill for the remaining 4 columns */}
          <motion.div
            variants={prefersReducedMotion ? undefined : fadeUp}
            className="md:col-span-4 relative bg-card p-0 min-h-[320px] overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <img 
              src="/images/m_and_a_carousel_1_1774797397476.png" 
              alt="DealFlow Premium Architecture"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all duration-1000 mix-blend-luminosity grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105"
            />
          </motion.div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
