"use client";

import {
  type HTMLMotionProps,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glowColor?: string;
}

export function GlowCard({
  children,
  className,
  glowColor = "rgba(212, 175, 55, 0.15)",
  ...props
}: GlowCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 20 };
  const scale = useSpring(1, springConfig);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleMouseEnter() {
    scale.set(1.01);
  }

  function handleMouseLeave() {
    scale.set(1);
  }

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-[2rem] bg-card/80 border border-white/[0.06] shadow-glass backdrop-blur-xl transition-[shadow,border-color] duration-500 hover:shadow-glass-elevated",
        className,
      )}
      style={{ scale }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Lit-edge top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {/* Mouse-tracking spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `,
        }}
      />
      {/* Inner shadow depth */}
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] z-0" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
