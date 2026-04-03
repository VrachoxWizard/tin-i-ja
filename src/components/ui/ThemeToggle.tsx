"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    // Read initial theme from document on mount
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("theme") as "light" | "dark" | null;
        if (stored) {
            setTheme(stored);
            applyTheme(stored);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
            applyTheme("dark");
        }
    }, []);

    function applyTheme(t: "light" | "dark") {
        const root = document.documentElement;
        if (t === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }

    function toggle() {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        applyTheme(next);
        localStorage.setItem("theme", next);
    }

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return <div className="w-9 h-9" />;
    }

    return (
        <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Uključi svjetli način" : "Uključi tamni način"}
            className="relative w-9 h-9 flex items-center justify-center rounded-sm border border-border bg-muted/40 hover:bg-muted hover:border-border/80 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                    <motion.span
                        key="sun"
                        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.2, ease: EASE_OUT } }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.6, transition: { duration: 0.14 } }}
                    >
                        <Sun className="w-4 h-4" />
                    </motion.span>
                ) : (
                    <motion.span
                        key="moon"
                        initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.2, ease: EASE_OUT } }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.6, transition: { duration: 0.14 } }}
                    >
                        <Moon className="w-4 h-4" />
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}
