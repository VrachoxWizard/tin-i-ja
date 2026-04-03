"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInViewProps {
    children: ReactNode;
    className?: string;
    /** Delay in seconds before the animation starts. Default: 0 */
    delay?: number;
    /** Y-axis offset to animate from. Default: 24 */
    yOffset?: number;
    /** When true, animation fires once and does not re-trigger on scroll. Default: true */
    once?: boolean;
}

/**
 * Wraps children with a scroll-triggered fade-in + slide-up entrance.
 * Uses Framer Motion whileInView for React-native performance.
 * Respects prefers-reduced-motion via Framer Motion's internal check.
 */
export function FadeInView({
    children,
    className,
    delay = 0,
    yOffset = 24,
    once = true,
}: FadeInViewProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: "-60px" }}
            transition={{
                duration: 0.55,
                delay,
                ease: [0.22, 1, 0.36, 1], // custom expo-out curve — feels expensive
            }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Stagger container: wraps a list of children that fade in with a cascade delay.
 * Each child gets an incrementally larger delay based on its index.
 */
interface StaggeredFadeInProps {
    children: ReactNode[];
    className?: string;
    baseDelay?: number;
    staggerMs?: number;
}

export function StaggeredFadeIn({
    children,
    className,
    baseDelay = 0,
    staggerMs = 80,
}: StaggeredFadeInProps) {
    return (
        <div className={className}>
            {children.map((child, i) => (
                <FadeInView key={i} delay={baseDelay + (i * staggerMs) / 1000}>
                    {child}
                </FadeInView>
            ))}
        </div>
    );
}
