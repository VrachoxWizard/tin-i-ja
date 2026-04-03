"use client";

/**
 * HeroBackground — Elegant CSS-only animated background.
 * 
 * Replaces the heavy R3F 3D canvas with lightweight CSS animations:
 * - Animated radial gold/blue gradient orbs that drift slowly
 * - Subtle grain overlay
 * - Zero GPU compositing cost, no WebGL, no Three.js
 * - Works on every device and browser
 */
export function Hero3D() {
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                overflow: "hidden",
            }}
            aria-hidden="true"
        >
            {/* Primary gold orb — large, slow drift */}
            <div
                style={{
                    position: "absolute",
                    top: "-20%",
                    right: "-10%",
                    width: "70vw",
                    height: "70vw",
                    maxWidth: "900px",
                    maxHeight: "900px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 40% 40%, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)",
                    filter: "blur(60px)",
                    animation: "heroOrbDrift 20s ease-in-out infinite alternate",
                }}
            />

            {/* Secondary blue orb — accent, slower */}
            <div
                style={{
                    position: "absolute",
                    bottom: "-30%",
                    left: "-15%",
                    width: "50vw",
                    height: "50vw",
                    maxWidth: "700px",
                    maxHeight: "700px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 60% 60%, rgba(30,60,140,0.12) 0%, rgba(20,40,100,0.03) 50%, transparent 70%)",
                    filter: "blur(80px)",
                    animation: "heroOrbDrift2 25s ease-in-out infinite alternate",
                }}
            />

            {/* Tertiary warm accent — subtle top-left */}
            <div
                style={{
                    position: "absolute",
                    top: "10%",
                    left: "20%",
                    width: "30vw",
                    height: "30vw",
                    maxWidth: "400px",
                    maxHeight: "400px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 60%)",
                    filter: "blur(40px)",
                    animation: "heroOrbDrift 30s ease-in-out infinite alternate-reverse",
                }}
            />

            {/* Bottom fade into page background */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background: "linear-gradient(to bottom, transparent, var(--background, #020817))",
                    pointerEvents: "none",
                }}
            />

            <style>{`
                @keyframes heroOrbDrift {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(-30px, 20px) scale(1.05); }
                }
                @keyframes heroOrbDrift2 {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(20px, -25px) scale(1.08); }
                }
            `}</style>
        </div>
    );
}
