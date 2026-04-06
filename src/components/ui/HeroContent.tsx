"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/Magnetic";

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroContent — the animated hero columns.
 * GSAP staggered line entrance for h1, mouse parallax + levitation on image.
 * Falls back to CSS-only on mobile / prefers-reduced-motion.
 */
export function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  // ── Mount: GSAP stagger entrance ─────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Explosive blur-in for eyebrow
      tl.from(eyebrowRef.current, {
        opacity: 0,
        filter: "blur(12px)",
        y: 20,
        duration: 1.2,
        delay: 0.1,
      })
        // Jaw-dropping tracking snap and blur resolution for main heading
        .from(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          {
            opacity: 0,
            filter: "blur(24px)",
            letterSpacing: "0.8em",
            scale: 1.1,
            y: 40,
            duration: 1.8,
            stagger: 0.15,
          },
          "-=1.0"
        )
        .from(
          bodyRef.current,
          { opacity: 0, filter: "blur(10px)", y: 20, duration: 1.2 },
          "-=1.4"
        )
        .from(
          ctaRef.current,
          { opacity: 0, scale: 0.95, duration: 1.0, ease: "back.out(1.5)" },
          "-=1.2"
        )
        .from(
          imageWrapRef.current,
          { opacity: 0, x: 60, rotateY: -15, scale: 0.95, filter: "blur(30px)", duration: 2.0 },
          "-=1.8"
        );

      // Abyssal Scroll: Text blurs out powerfully as user scrolls down
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: "#hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: -100,
        scale: 0.95,
        opacity: 0,
        filter: "blur(24px)",
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Mouse parallax on hero image ──────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;
    if (prefersReduced || isMobile || !imageWrapRef.current) return;

    const el = imageWrapRef.current;
    const maxRot = 4; // max ±4deg tilt

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth: W, innerHeight: H } = window;
      // Normalize to -1 → 1
      const nx = (e.clientX / W - 0.5) * 2;
      const ny = (e.clientY / H - 0.5) * 2;

      gsap.to(el, {
        rotateY: nx * maxRot,
        rotateX: -ny * (maxRot * 0.6),
        duration: 1.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        rotateY: 0,
        rotateX: 0,
        duration: 1.8,
        ease: "elastic.out(1, 0.6)",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="container relative z-10 mx-auto max-w-7xl px-4 lg:px-8"
    >
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">

        {/* ── LEFT COLUMN: Typography ──── */}
        <div className="space-y-10">

          <h1 className="sr-only">Ekskluzivna M&A platforma za prodaju i kupnju tvrtki u Hrvatskoj</h1>

          {/* Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-4 gpu-layer">
            <div className="h-[1px] w-12 bg-primary/60" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary/80 font-semibold">
              Kapital Ekosustav
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 border-l border-primary/20 pl-4 ml-2">
              Akreditirani Savjetnici
            </span>
          </div>

          {/* h1 — each line allowing overflow for massive blur explosion */}
          <div aria-hidden="true" className="font-heading font-light leading-tight tracking-tight text-foreground">
            <span className="block pb-2">
              <span
                ref={line1Ref}
                className="block text-[clamp(2.8rem,7vw,5.5rem)] gpu-layer tracking-[-0.02em] transform-origin-left"
              >
                Diskretan
              </span>
            </span>
            <span className="block pb-2">
              <span
                ref={line2Ref}
                className="block text-[clamp(2.8rem,7vw,5.5rem)] text-transparent clip-text-gold bg-clip-text relative z-10 py-1 gpu-layer tracking-[-0.02em] font-medium transform-origin-left"
              >
                prijenos
              </span>
            </span>
            <span className="block pb-2">
              <span
                ref={line3Ref}
                className="block text-[clamp(2.8rem,7vw,5.5rem)] gpu-layer tracking-[-0.02em] transform-origin-left"
              >
                vlasništva.
              </span>
            </span>
          </div>

          {/* Body */}
          <p
            ref={bodyRef}
            className="max-w-lg text-lg text-muted-foreground/80 leading-relaxed font-sans"
          >
            Ekskluzivna platforma za diskretnu prodaju i kupnju tvrtki u Hrvatskoj. AI 
            vrednovanje, visoko-kvalificirani kupci i sigurna dokumentacija u zatvorenom sustavu.
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="flex flex-wrap gap-5 pt-6 gpu-layer">
            <Magnetic strength={25}>
              <Link href="/sell" className="inline-block">
                <Button className="h-14 px-8 rounded-sm bg-primary/10 border border-primary/30 text-primary text-[11px] uppercase tracking-[0.2em] font-bold shadow-ambient-gold hover:bg-primary/20 hover:border-primary/50 hover:translate-y-[-2px] transition-all duration-500 cursor-pointer">
                  Započni proces
                  <ArrowRight className="w-4 h-4 ml-3 opacity-70" />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic strength={25}>
              <Link href="/buy" className="inline-block">
                <Button variant="outline" className="h-14 px-8 rounded-sm bg-transparent text-foreground text-[11px] uppercase tracking-[0.2em] font-semibold border-border/50 hover:bg-card-elevated hover:border-foreground/30 hover:translate-y-[-2px] transition-all duration-500 cursor-pointer group">
                  <Lock className="w-3.5 h-3.5 mr-2.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  NDA Pristup
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Floating Image ──── */}
        {/* Perspective wrapper for 3D mouse parallax */}
        <div style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}>
          <div
            ref={imageWrapRef}
            className="relative group animate-levitate gpu-layer"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Main image frame */}
            <div
              className="relative z-10 aspect-[3/4] max-h-[70vh] border border-border/30
              bg-card-elevated p-3 glass-surface rounded-sm
              shadow-[0_24px_64px_rgba(4,9,20,0.5),0_8px_24px_rgba(4,9,20,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]
              transition-shadow duration-700 hover:shadow-ambient-gold"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="relative w-full h-full rounded-[2px] overflow-hidden bg-[#0A101C]">
                <Image
                  src="/assets/hero_bg.png"
                  alt="Moderni poslovni neboder"
                  fill
                  priority
                  className="object-cover filter contrast-[1.15] saturate-[0.3] mix-blend-screen opacity-60"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
              </div>

              {/* Floating badge — offset with translateZ for depth */}
              <Magnetic strength={15}>
                <div
                  className="absolute -bottom-5 -right-5 md:-bottom-8 md:-right-6
                    bg-card/80 backdrop-blur-md border border-primary/20 p-5 md:p-6
                    max-w-[200px] md:max-w-[240px] z-20 rounded-sm
                    shadow-ambient-gold"
                  style={{ transform: "translateZ(32px)" }}
                >
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary mb-2 md:mb-3 opacity-90" />
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-semibold text-foreground/90">
                    100% Povjerljivo
                  </p>
                </div>
              </Magnetic>
            </div>

            {/* Ambient glow beneath image */}
            <div
              className="absolute inset-x-8 -bottom-8 h-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.1) 0%, transparent 70%)",
                filter: "blur(24px)",
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
