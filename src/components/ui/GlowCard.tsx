"use client";

import {
  type HTMLMotionProps,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glowColor?: string; // Kept for API compatibility, used as subtle reflection
}

export function GlowCard({
  children,
  className,
  glowColor = "rgba(255, 255, 255, 0.05)",
  ...props
}: GlowCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-sm bg-card border border-white/5 transition-colors duration-700 hover:bg-card/80",
        className,
      )}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Subtle edge illumination instead of a blob */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 40%
            )
          `,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
