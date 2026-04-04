"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;

function applyTheme(t: "light" | "dark") {
    const root = document.documentElement;
    if (t === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}

function getSnapshot(): "light" | "dark" {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
    return "dark";
}

function subscribe(callback: () => void) {
    const storageHandler = (e: StorageEvent) => {
        if (e.key === "theme") callback();
    };
    const mediaHandler = () => callback();
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    window.addEventListener("storage", storageHandler);
    mql.addEventListener("change", mediaHandler);

    return () => {
        window.removeEventListener("storage", storageHandler);
        mql.removeEventListener("change", mediaHandler);
    };
}

export function ThemeToggle() {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Apply theme after React commits, so it wins over React's className reconciliation
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    function toggle() {
        const next = theme === "light" ? "dark" : "light";
        applyTheme(next);
        localStorage.setItem("theme", next);
        // Trigger re-render via storage event (cross-tab sync + same-tab update)
        window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: next }));
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
