"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Building2, Lock } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TeaserCard } from "@/components/features/TeaserCard";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/Magnetic";

gsap.registerPlugin(ScrollTrigger);

interface Listing {
  id: string;
  public_code: string;
  industry_nkd: string;
  region: string;
  revenue_eur: number;
  ebitda_eur: number;
  asking_price_eur: number;
  blind_teaser: string | null;
}

interface VaultSectionProps {
  featuredListings: Listing[];
}

/**
 * VaultSection — "Aktualne Prilike" section.
 * Cards reveal from an isometric 3D angle, snapping flat as they reach the viewport.
 * Mobile: simple Y-axis reveal only (no 3D rotation).
 * Hover: CSS vault-card class handles translateY(-8px) scale(1.02) lift.
 */
export function VaultSection({ featuredListings }: VaultSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !sectionRef.current) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // ── Header reveal ─────────────────────────────────────────────────────
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          once: true,
        },
      });

      // ── Card isometric reveal ─────────────────────────────────────────────
      const cards = gridRef.current?.querySelectorAll(".iso-reveal-target");
      if (!cards || cards.length === 0) return;

      if (isMobile) {
        // Simple elegant Y-axis reveal on mobile
        gsap.from(cards, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        });
      } else {
        // Desktop: full isometric 3D snap-flat reveal
        // Cards start angled in isometric perspective, snap to flat 2D
        gsap.from(cards, {
          opacity: 0,
          y: 80,
          rotateX: 40,
          rotateZ: -12,
          scale: 0.88,
          transformOrigin: "50% 80%",
          duration: 1.1,
          stagger: {
            amount: 0.4,
            from: "start",
          },
          ease: "expo.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 78%",
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
      className="py-40 relative overflow-hidden bg-card-elevated/5"
    >
      {/* Ambient glow radial */}
      <div
        className="absolute top-0 right-[-20%] w-[800px] h-[800px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(201,168,76,0.05) 0%, transparent 60%)",
        }}
      />
      {/* Bottom vignette anchor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(1,4,8,0.4) 0%, transparent 100%)",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 lg:px-8">

        {/* Header */}
        <div ref={headerRef} className="text-center mb-24 flex flex-col items-center">
          <Lock className="w-10 h-10 text-primary mb-8 animate-float" />
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-primary font-bold mb-6">
            Aktualne Prilike
          </p>
          <h2
            className="text-[clamp(2.5rem,6vw,5rem)] font-heading font-black
              text-foreground tracking-tighter uppercase mb-10 leading-[1]"
          >
            Pregledajte ponudu
          </h2>
          <Magnetic strength={15}>
            <Link href="/listings" className="inline-block">
              <Button
                variant="outline"
                className="h-14 px-8 rounded-none border-primary/40 text-xs tracking-[0.2em]
                  bg-transparent hover:bg-card-elevated shadow-ambient-gold
                  hover:text-primary transition-all duration-300 uppercase cursor-pointer"
              >
                Sve Prilike
              </Button>
            </Link>
          </Magnetic>
        </div>

        {/* Listings grid */}
        {featuredListings.length > 0 ? (
          /* perspective on wrapper gives 3D context for sibling cards */
          <div
            ref={gridRef}
            className="grid gap-12 lg:grid-cols-2 relative max-w-5xl mx-auto"
            style={{ perspective: "1200px" }}
          >
            {/* Vertical divider */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/20 hidden lg:block" />

            {featuredListings.map((listing, i) => (
              <div
                key={listing.id}
                className={[
                  "iso-reveal-target vault-card",
                  "relative border border-border/30 bg-card-elevated shadow-glass p-2",
                  i === 1 ? "lg:mt-32" : "",
                ].join(" ")}
              >
                <TeaserCard
                  publicCode={listing.public_code}
                  industry={listing.industry_nkd}
                  region={listing.region}
                  revenue={listing.revenue_eur}
                  ebitda={listing.ebitda_eur}
                  askingPrice={listing.asking_price_eur}
                  blindTeaserHtml={listing.blind_teaser || ""}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="border border-border/40 bg-card-elevated/20 p-20 shadow-glass
                relative overflow-hidden glass-surface"
            >
              <Building2 className="w-12 h-12 text-primary/70 mx-auto mb-8 relative z-10" />
              <p className="text-muted-foreground leading-relaxed text-sm uppercase tracking-widest relative z-10 font-bold">
                Sve prilike su trenutno pod ekskluzivnim ugovorom.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
