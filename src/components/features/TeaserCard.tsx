"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import {
  ArrowRight,
  Lock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { sanitizeHtml } from "@/lib/sanitize";

interface TeaserCardProps {
  publicCode: string;
  industry: string;
  region: string;
  revenue: number;
  ebitda: number;
  askingPrice: number;
  blindTeaserHtml: string;
  isVerified?: boolean;
}

function formatCurrency(value: number) {
  if (value >= 1_000_000) {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: "EUR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

const ROTATION_RANGE = 7;

export function TeaserCard({
  publicCode,
  industry,
  region,
  revenue,
  ebitda,
  askingPrice,
  blindTeaserHtml,
  isVerified = true,
}: TeaserCardProps) {
  const ebitdaMargin = revenue > 0 ? Math.round((ebitda / revenue) * 100) : 0;

  // ── Framer Motion Physics ──────────────────────────────────────────────────
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${ROTATION_RANGE}deg`, `-${ROTATION_RANGE}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${ROTATION_RANGE}deg`, `${ROTATION_RANGE}deg`]);

  // Dynamic Glare tracking
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(212,175,55,0.12) 0%, transparent 60%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="h-full relative group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="flex flex-col h-full border border-border/40 bg-card/60 backdrop-blur-md shadow-glass hover:border-primary/40 transition-colors duration-500 rounded-sm overflow-hidden"
      >
        {/* Subtle top edge highlight */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:opacity-100 opacity-50 transition-opacity duration-500" />

        {/* Dynamic Glare Overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen"
          style={{ background: glareBackground, transform: "translateZ(10px)" }}
        />

        <CardHeader className="pb-2 pt-6 px-7 relative z-10" style={{ transform: "translateZ(30px)" }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <Badge
              variant="outline"
              className="bg-transparent text-muted-foreground border-border/50 font-medium px-2.5 py-0.5 tracking-widest text-[10px] uppercase rounded-sm"
            >
              Šifra {publicCode}
            </Badge>

            <div className="flex items-center gap-2">
              {ebitdaMargin > 0 && (
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 text-[10px] font-medium tracking-wide rounded-sm px-2 py-0.5"
                >
                  {ebitdaMargin}% marža
                </Badge>
              )}
              {isVerified && (
                <div className="flex items-center text-emerald-500/80 text-[11px] font-medium tracking-wide uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verificirano
                </div>
              )}
            </div>
          </div>

          <h3 className="text-xl font-heading font-medium text-foreground leading-tight tracking-tight mb-2">
            Tvrtka u sektoru{" "}
            <span className="text-foreground">{industry}</span>
          </h3>

          <div className="flex items-center text-muted-foreground/70 text-xs tracking-wide">
            <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            {region}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-6 px-7 pt-4 relative z-10" style={{ transform: "translateZ(20px)" }}>
          {/* ── Financial Data ─────────────── */}
          <div className="flex items-center gap-8 bg-card-elevated/40 rounded-sm p-4 border border-border/20">
            <div className="space-y-1">
              <div className="text-muted-foreground/60 text-[10px] uppercase tracking-widest font-semibold">
                Prihod
              </div>
              <p className="text-2xl font-heading font-medium text-foreground tabular-nums tracking-tight">
                {formatCurrency(revenue)}
              </p>
            </div>

            <div className="w-px h-8 bg-border/40" />

            <div className="space-y-1">
              <div className="text-muted-foreground/60 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
                EBITDA
              </div>
              <p className="text-2xl font-heading font-medium text-primary tabular-nums tracking-tight">
                {formatCurrency(ebitda)}
              </p>
            </div>
          </div>

          {/* ── Blind teaser excerpt ────────────────────────────────── */}
          <div className="relative flex-1">
            <div
              className="text-sm text-muted-foreground/80 space-y-2 line-clamp-4 leading-relaxed font-sans"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(blindTeaserHtml) }}
            />
          </div>

          {/* ── Asking price ──────────────────── */}
          <div className="pt-2" style={{ transform: "translateZ(40px)" }}>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-semibold mb-1">
              Očekivana cijena
            </p>
            <p className="text-3xl font-heading font-medium text-foreground tabular-nums tracking-tight">
              {formatCurrency(askingPrice)}
            </p>
          </div>
        </CardContent>

        {/* ── CTAs ────────────────────────────────────── */}
        <CardFooter className="pt-6 pb-6 px-7 flex gap-3 mt-auto relative z-10" style={{ transform: "translateZ(30px)" }}>
          <Link href={`/listings/${publicCode}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full text-xs tracking-widest uppercase cursor-pointer"
            >
              Teaser
            </Button>
          </Link>

          <Link href={`/listings/${publicCode}`} className="flex-[1.5]">
            <Button
              variant="default"
              className="w-full text-xs tracking-widest uppercase font-semibold cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 mr-2 shrink-0 opacity-70" />
              NDA pristup
              <ArrowRight className="w-3.5 h-3.5 ml-2 shrink-0 opacity-70" />
            </Button>
          </Link>
        </CardFooter>
      </motion.div>
    </motion.div>
  );
}
