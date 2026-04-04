"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Hero3D — Premium cinematic 2D hero background.
 *
 * Features:
 * - Animated floating glassmorphism orbs (CSS GPU-composited)
 * - Subtle SVG financial grid lines for M&A data context
 * - Animated dot particles using canvas for zero-DOM-node performance
 * - Zero WebGL, zero Three.js — works on all devices & browsers
 */

// ── Animated particle field (canvas) ──────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      radius: number; opacity: number;
    };

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const particles: Particle[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.12,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.35 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.06 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        ctx.fill();

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges softly
        if (p.x < 0 || p.x > W()) p.vx *= -1;
        if (p.y < 0 || p.y > H()) p.vy *= -1;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  );
}

// ── Financial grid SVG overlay ─────────────────────────────────────────────────
function FinancialGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity: 0.04 }}
    >
      <defs>
        <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
          <path
            d="M 64 0 L 0 0 0 64"
            fill="none"
            stroke="rgba(212,175,55,1)"
            strokeWidth="0.5"
          />
        </pattern>
        <pattern id="grid-large" width="256" height="256" patternUnits="userSpaceOnUse">
          <rect width="256" height="256" fill="url(#grid)" />
          <path
            d="M 256 0 L 0 0 0 256"
            fill="none"
            stroke="rgba(212,175,55,1)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-large)" />
    </svg>
  );
}

// ── Floating data point tickers ────────────────────────────────────────────────
const TICKERS = [
  { label: "EV/EBITDA", value: "8.2×", x: "12%", y: "18%", delay: 0 },
  { label: "IRR", value: "24.7%", x: "78%", y: "28%", delay: 0.4 },
  { label: "Prihod", value: "€4.2M", x: "65%", y: "68%", delay: 0.8 },
  { label: "EBITDA", value: "€1.1M", x: "8%", y: "72%", delay: 1.2 },
];

function FloatingTickers() {
  return (
    <>
      {TICKERS.map((t) => (
        <motion.div
          key={t.label}
          className="absolute hidden xl:block"
          style={{ left: t.x, top: t.y }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: t.delay + 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5 + t.delay, repeat: Infinity, ease: "easeInOut" }}
            className="bg-card-elevated/60 backdrop-blur-md border border-primary/15 px-3 py-2 shadow-glass"
          >
            <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-0.5">
              {t.label}
            </p>
            <p className="text-sm font-heading font-bold text-primary tabular-nums">{t.value}</p>
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function Hero3D() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden gpu-layer"
      aria-hidden="true"
    >
      {/* Financial grid */}
      <FinancialGrid />

      {/* Particle network */}
      <ParticleCanvas />

      {/* Primary gold ambient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          right: "-8%",
          width: "65vw",
          height: "65vw",
          maxWidth: "900px",
          maxHeight: "900px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 40%, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.05) 45%, transparent 70%)",
          filter: "blur(72px)",
          animation: "heroOrbDrift 22s ease-in-out infinite alternate",
        }}
      />

      {/* Trust-blue deep orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-35%",
          left: "-15%",
          width: "55vw",
          height: "55vw",
          maxWidth: "750px",
          maxHeight: "750px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 60% 60%, rgba(21,101,192,0.14) 0%, rgba(15,60,130,0.04) 50%, transparent 70%)",
          filter: "blur(90px)",
          animation: "heroOrbDrift2 28s ease-in-out infinite alternate",
        }}
      />

      {/* Tertiary gold accent top-center */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          left: "30%",
          width: "28vw",
          height: "28vw",
          maxWidth: "380px",
          maxHeight: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)",
          filter: "blur(50px)",
          animation: "heroOrbDrift 35s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Vignette — darker edges for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,7,18,0.7) 100%)",
        }}
      />

      {/* Bottom page fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "40%",
          background: "linear-gradient(to bottom, transparent, var(--background, #030712))",
        }}
      />

      {/* Floating financial tickers */}
      <FloatingTickers />

      <style>{`
        @keyframes heroOrbDrift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-35px, 25px) scale(1.06); }
        }
        @keyframes heroOrbDrift2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(28px, -30px) scale(1.09); }
        }
      `}</style>
    </div>
  );
}
