"use client";

import dynamic from "next/dynamic";

const Hero3DInner = dynamic(
    () => import("@/components/hero-3d").then((m) => ({ default: m.Hero3D })),
    {
        ssr: false,
        loading: () => <div className="absolute inset-0 -z-10" />,
    },
);

export function Hero3DLazy() {
    return <Hero3DInner />;
}
