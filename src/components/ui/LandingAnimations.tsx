"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

// ── Animated counter hook ──────────────────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1800) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration, bounce: 0 });

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, motionVal, target]);

  useEffect(() => {
    return spring.on("change", (v) => setDisplay(Math.round(v)));
  }, [spring]);

  return { ref, display };
}

// ── Stat counter component ─────────────────────────────────────────────────────
export function AnimatedStat({
  num,
  suffix = "",
  label,
  sub,
}: {
  num: number | string;
  suffix?: string;
  label: string;
  sub: string;
}) {
  const isNumeric = typeof num === "number";
  const { ref, display } = useAnimatedCounter(isNumeric ? (num as number) : 0);

  return (
    <div ref={ref} className="pl-4 md:pl-8 first:pl-0">
      <p className="text-[0.7rem] uppercase tracking-[0.3em] font-bold text-primary shadow-sm mb-4 md:mb-6">
        {sub}
      </p>
      <p className="text-4xl md:text-5xl lg:text-7xl font-heading font-black text-transparent clip-text-gold bg-clip-text text-glow-gold tracking-tighter mb-2 md:mb-4">
        {isNumeric ? (
          <>
            {display}
            {suffix}
          </>
        ) : (
          num
        )}
      </p>
      <p className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-[0.2em]">
        {label}
      </p>
    </div>
  );
}

// ── Trust marquee ticker ───────────────────────────────────────────────────────
const TRUST_ITEMS = [
  "100% Povjerljivo",
  "AI Procjena",
  "NDA Zaštita",
  "Diskretni Teaseri",
  "Sigurni Deal Room",
  "Verificirani Kupci",
  "Ekskluzivna Uparivanja",
  "Pravna Sigurnost",
];

export function TrustMarquee() {
  return (
    <div
      className="relative w-full overflow-hidden border-y border-border/20 py-4 bg-card-elevated/30"
      aria-hidden="true"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {/* Duplicate for seamless loop */}
        {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground/70 shrink-0"
          >
            <span className="w-1 h-1 rounded-full bg-primary inline-block shrink-0" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Stagger children wrapper ───────────────────────────────────────────────────
const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function StaggerGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
