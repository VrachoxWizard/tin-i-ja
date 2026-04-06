"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroCinematic() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !bgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        scale: 1.4,
        y: "20vh",
        opacity: 0,
        filter: "blur(20px)",
        ease: "none",
        scrollTrigger: {
          trigger: "#hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bgRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base: Abyss Black */}
      <div className="absolute inset-0 bg-[#02050A]" />

      {/* Perspective container for volumetric depth */}
      <div
        className="absolute inset-0"
        style={{
          perspective: "3000px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Deep Background Void Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.08)_0%,transparent_70%)]" />

        {/* Primary Volumetric Core — Flowing Gold */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 90, 0],
            opacity: [0.15, 0.35, 0.15],
            borderRadius: ["40%", "60%", "40%"]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(-300px)" }}
          className="absolute top-[5%] left-[10%] w-[60vw] h-[50vw]
            bg-amber-500/20 blur-[130px] mix-blend-color-dodge"
        />

        {/* Secondary Liquid Mass — Bronze/Copper */}
        <motion.div
          animate={{
            x: ["-10%", "15%", "-10%"],
            y: ["0%", "10%", "0%"],
            scale: [1, 1.5, 1],
            rotate: [0, -60, 0],
          }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          style={{ transform: "translateZ(-600px)" }}
          className="absolute bottom-[10%] right-[5%] w-[70vw] h-[40vw] 
            bg-[#B87333]/15 blur-[160px] mix-blend-color-dodge 
            rounded-[50%_40%_60%_30%]"
        />

        {/* Micro Intensity Core — bright champagne flair */}
        <motion.div
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ transform: "translateZ(100px)" }}
          className="absolute top-[40%] left-[45%] w-[25vw] h-[25vw] 
            bg-[#F4E2B2]/15 blur-[90px] mix-blend-color-dodge rounded-full"
        />
      </div>

      {/* Architectural grid — laser blueprint feel */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 30%, black 10%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 30%, black 10%, transparent 85%)",
        }}
      />

      {/* Fine diagonal hatching — organic texture mapped to rigid structure */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(212,175,55,1) 0px, rgba(212,175,55,1) 1px, transparent 0px, transparent 32px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 75% 25%, black 0%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 75% 25%, black 0%, transparent 80%)",
        }}
      />

      {/* Deep vignette — pulls focus to the center and blends out hard edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#010408_95%)] pointer-events-none mix-blend-multiply" />
    </div>
  );
}
