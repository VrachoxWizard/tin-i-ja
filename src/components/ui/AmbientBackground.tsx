"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Slower parallax for the deep background image
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  // Faster parallax for the floating data nodes/grid
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[-1] overflow-hidden bg-navy select-none"
    >
      {/* Deepest Space Grid */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-[-50%] opacity-[0.03]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 4, delay: 0.5 }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #FFFFFF 1px, transparent 1px),
              linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
            transform: "perspective(1000px) rotateX(75deg) scale(2.5)",
            transformOrigin: "top center",
          }}
        />
      </motion.div>

      {/* Cinematic Fog & Navy Wash */}
      <div className="absolute inset-0 bg-linear-to-b from-navy/30 via-navy/80 to-navy" />

      {/* Heroic Central Glow */}
      <motion.div
        style={{ y: gridY }}
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] rounded-[100%] bg-trust/15 blur-[120px] mix-blend-screen pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Accent Gold Glow (Left) */}
      <motion.div
        className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gold/10 blur-[130px] mix-blend-screen pointer-events-none"
        animate={{
          x: [0, 40, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      {/* Accent Teal/Navy Glow (Right) */}
      <motion.div
        className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#1565C0]/10 blur-[140px] mix-blend-screen pointer-events-none"
        animate={{
          y: [0, -40, 0],
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}
