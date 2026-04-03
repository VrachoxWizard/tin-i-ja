"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Snap to top and hold the loader for 1.8s
        window.scrollTo(0, 0);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="preloader"
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02050A]"
                        exit={{ y: "-100%" }}
                        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <motion.div
                            className="text-[4rem] font-heading font-black text-transparent clip-text-gold bg-clip-text text-glow-gold"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            DF
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {children}
        </>
    );
}
