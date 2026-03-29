"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { SectionShell } from "@/components/shared/SectionShell";

const IMAGES = [
  {
    src: "/images/m_and_a_carousel_1_1774797397476.png",
    alt: "Executive Desk and Fountain Pen",
  },
  {
    src: "/images/m_and_a_carousel_2_1774797546491.png",
    alt: "Luxury Boardroom overlooking the city",
  },
];

export function GalleryCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Moves the carousel slightly to the left as you scroll down
  const xTransform = useTransform(scrollYProgress, [0, 1], ["5%", "-25%"]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <SectionShell spacing="none" className="py-24 md:py-40 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
        <p className="text-sm tracking-[0.2em] text-gold font-semibold uppercase mb-6 flex items-center gap-4">
          <span className="w-8 h-px bg-gold shadow-[0_0_10px_rgba(229,192,123,0.5)]" />
          Iskustvo
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-[1.05]">
          Ambijent povjerenja. <br />
          <span className="text-white/60 italic font-light">Prostor za velike odluke.</span>
        </h2>
      </div>

      <div ref={containerRef} className="relative w-full h-[50vh] md:h-[70vh] flex items-center">
        <motion.div 
          className="flex gap-4 md:gap-8 px-4 sm:px-6 lg:px-8 absolute left-0"
          style={{ x: prefersReducedMotion ? 0 : xTransform, opacity: prefersReducedMotion ? 1 : opacityTransform }}
        >
          {IMAGES.map((img, idx) => (
            <div 
              key={idx} 
              className="relative w-[85vw] md:w-[65vw] lg:w-[45vw] h-[40vh] md:h-[60vh] shrink-0 rounded-sm overflow-hidden border border-white/5"
            >
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-[2000ms] ease-out" 
                quality={90}
                priority={idx === 0}
              />
              {/* Vignette effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/20 to-[#02040A]/80 pointer-events-none" />
            </div>
          ))}
        </motion.div>
      </div>
    </SectionShell>
  );
}
