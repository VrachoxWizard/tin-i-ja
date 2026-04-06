"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeInView } from "@/components/ui/FadeInView";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "01. Apsolutna diskrecija",
    body: "Kreiramo tzv. slijepe (blind) teazere bez otkrivanja identiteta vaše tvrtke.",
  },
  {
    title: "02. Ekosustav kapitala",
    body: "Napredni algoritmi precizno povezuju vaš kapital s provjerenim prilikama u Hrvatskoj.",
  },
  {
    title: "03. Data Room Trezor",
    body: "Detaljan uvid odobrava se isključivo nakon potpisivanja propisanog NDA ugovora.",
  },
];

/**
 * ProtocolSection — the two-image + feature list block.
 * GSAP ScrollTrigger parallax: bg image slower, fg image faster.
 * 3D diorama tilt: image container angled toward the text.
 * Feature items stagger in as a single block, not individual FadeInViews.
 */
export function ProtocolSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const fgImageRef = useRef<HTMLDivElement>(null);
  const featureItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !sectionRef.current) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // ── Parallax on images ──────────────────────────────────────────────
      if (!isMobile) {
        // Background (larger) image — drifts DOWN slowly as user scrolls
        gsap.to(bgImageRef.current, {
          y: "18%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        });

        // Foreground (smaller) image — rises UP faster as user scrolls
        gsap.to(fgImageRef.current, {
          y: "-22%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.0,
          },
        });
      }

      // ── Feature items stagger reveal ────────────────────────────────────
      const items = featureItemsRef.current?.querySelectorAll(".feature-item");
      if (items && items.length > 0) {
        gsap.from(items, {
          opacity: 0,
          x: -36,
          duration: 0.7,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featureItemsRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 relative border-b border-border/20 bg-card-elevated/10 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-center">

          {/* ── LEFT: Image diorama ──────────────────────────── */}
          {/*
            Outer div: perspective + subtle rotateY tilt toward text (right side).
            This creates a diorama / cinematic angle effect.
          */}
          <div
            className="w-full lg:w-1/2 relative h-[600px] gpu-layer"
            style={{
              perspective: "1000px",
              perspectiveOrigin: "80% 50%",
            }}
          >
            <div
              style={{
                transform: "perspective(1000px) rotateY(-6deg) rotateX(1deg)",
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0"
            >
              {/* Background (large) image — parallax target */}
              <div
                ref={bgImageRef}
                className="absolute top-0 right-0 w-[80%] h-[460px]
                  border border-border/15 overflow-hidden group gpu-layer
                  shadow-[0_32px_64px_rgba(0,0,0,0.5),0_8px_24px_rgba(0,0,0,0.3)]"
              >
                <Image
                  src="/assets/protocol_base.png"
                  alt="Luxury office"
                  fill
                  loading="lazy"
                  className="object-cover filter grayscale contrast-125 scale-110"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                {/* Subtle top-edge gold shimmer on image */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              </div>

              {/* Foreground (smaller) image — faster parallax target */}
              <div
                ref={fgImageRef}
                className="absolute bottom-0 left-0 w-[55%] h-[52%]
                  border border-primary/25 p-2 bg-card-elevated z-20
                  shadow-ambient-gold gpu-layer
                  glass-surface"
              >
                <div className="relative w-full h-full border border-border/15 overflow-hidden">
                  <Image
                    src="/assets/protocol_fg.png"
                    alt="Business meeting"
                    fill
                    loading="lazy"
                    className="object-cover filter grayscale contrast-125"
                    sizes="(max-width: 1024px) 55vw, 25vw"
                  />
                  {/* Gold border accent — top edge */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Text content ──────────────────────────── */}
          <div className="w-full lg:w-1/2 pt-10 lg:pt-0">

            {/* Section heading block — single FadeInView */}
            <FadeInView>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] w-12 bg-primary" />
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-primary font-bold">
                  Standard Usluge
                </span>
              </div>
              <h2
                className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-heading font-black
                  tracking-tighter leading-[1.05] mb-14 uppercase relative inline-block"
              >
                EKSKLUZIVNO POSREDOVANJE.
                <span className="block text-transparent clip-text-gold bg-clip-text text-glow-gold mt-2">
                  SIGURNA TRANSAKCIJA.
                </span>
              </h2>
            </FadeInView>

            {/* Feature items — GSAP stagger handles reveal (refs set) */}
            <div ref={featureItemsRef} className="space-y-12">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="feature-item group border-l border-primary/20 pl-8
                    hover:border-primary transition-colors duration-500 gpu-layer"
                  style={{ opacity: 0 }} // initial state; GSAP handles reveal
                >
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3 tracking-wide">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
