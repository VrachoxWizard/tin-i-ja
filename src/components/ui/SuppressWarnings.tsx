"use client";

import { useEffect } from "react";

export function SuppressWarnings() {
    useEffect(() => {
        const originalWarn = console.warn;
        console.warn = (...args) => {
            if (
                typeof args[0] === "string" &&
                args[0].includes("Clock: This module has been deprecated. Please use THREE.Timer instead")
            ) {
                return; // Suppress THREE.Clock warnings until @react-three/fiber updates to THREE.Timer
            }
            originalWarn.apply(console, args);
        };

        return () => {
            console.warn = originalWarn;
        };
    }, []);

    return null;
}
