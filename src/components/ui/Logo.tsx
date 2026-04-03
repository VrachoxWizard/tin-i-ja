"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function Logo({ className = "" }: { className?: string }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative flex items-center justify-center overflow-visible ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <svg
                width="44"
                height="44"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible filter drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
            >
                {/* Outer glowing ring that spins on hover */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-primary/20"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isHovered ? 180 : 0 }}
                    transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                    style={{ originX: "50px", originY: "50px" }}
                />

                {/* D - Interlocking */}
                <motion.path
                    d="M 35,25 L 35,75 C 65,75 65,25 35,25 Z"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-primary"
                    strokeLinecap="square"
                    strokeLinejoin="bevel"
                    initial={{ pathLength: 1, opacity: 1 }}
                    animate={{
                        pathLength: isHovered ? [0, 1] : 1,
                        opacity: isHovered ? [0.6, 1] : 1
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* F - Interlocking cutting through the D */}
                <motion.path
                    d="M 45,25 L 45,75 M 45,25 L 70,25 M 45,50 L 60,50"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    className="text-primary"
                    strokeLinecap="square"
                    initial={{ pathLength: 1, opacity: 1 }}
                    animate={{
                        pathLength: isHovered ? [0, 1] : 1,
                        opacity: isHovered ? [0.6, 1] : 1
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
                />

                {/* Center alignment node - sparks on hover */}
                <motion.circle
                    cx="45"
                    cy="50"
                    r="4"
                    fill="currentColor"
                    className="text-foreground"
                    initial={{ scale: 1, opacity: 0.3 }}
                    animate={{
                        scale: isHovered ? [1, 2.5, 1.2] : 1,
                        opacity: isHovered ? [0.3, 1, 0.8] : 0.3
                    }}
                    transition={{ duration: 0.8 }}
                />
            </svg>
        </div>
    );
}
