"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Lock,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/GlowCard";
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
  // Compact formatting for large values (1M+)
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
  // EBITDA margin as a trust signal (ebitda/revenue)
  const ebitdaMargin = revenue > 0 ? Math.round((ebitda / revenue) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <GlowCard className="flex flex-col h-full border border-border/40 bg-card/95 shadow-glass hover:shadow-glow-gold hover:border-primary/50 transition-all duration-500 rounded-none overflow-hidden group">

        {/* ── Premium accent bar — gold gradient ───────────────────── */}
        <div className="h-[3px] w-full bg-linear-to-r from-df-trust-blue/60 via-[#D4AF37] to-df-trust-blue/60 group-hover:opacity-100 opacity-80 transition-opacity duration-300" />

        <CardHeader className="pb-4 pt-7 px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <Badge
              variant="outline"
              className="bg-muted text-muted-foreground border-border font-medium px-3 py-1 rounded-none tracking-wide text-xs"
            >
              Šifra {publicCode}
            </Badge>

            <div className="flex items-center gap-2">
              {/* EBITDA margin badge */}
              {ebitdaMargin > 0 && (
                <Badge
                  variant="outline"
                  className="bg-primary/6 text-primary border-primary/20 rounded-none text-xs font-medium"
                >
                  {ebitdaMargin}% marža
                </Badge>
              )}
              {isVerified && (
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-none">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Verificirano
                </Badge>
              )}
            </div>
          </div>

          <h3 className="text-xl font-heading font-semibold text-foreground leading-tight mb-3">
            Tvrtka u sektoru{" "}
            <span className="text-foreground">{industry}</span>
          </h3>

          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-1.5 text-df-trust-blue shrink-0" />
            {region}
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-5 px-6">
          {/* ── Financial data grid — elevated numbers ─────────────── */}
          <div className="grid grid-cols-2 gap-0 border border-border bg-muted/20 divide-x divide-border">
            <div className="px-5 py-4 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider">
                <TrendingUp className="w-3 h-3" />
                Prihod
              </div>
              <p className="text-2xl font-heading font-bold text-foreground tabular-nums">
                {formatCurrency(revenue)}
              </p>
            </div>

            <div className="px-5 py-4 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider">
                <Building2 className="w-3 h-3" />
                EBITDA
              </div>
              <p className="text-2xl font-heading font-bold text-primary tabular-nums">
                {formatCurrency(ebitda)}
              </p>
            </div>
          </div>

          {/* ── Blind teaser excerpt ────────────────────────────────── */}
          <div className="relative">
            <div
              className="text-sm text-muted-foreground space-y-2 line-clamp-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(blindTeaserHtml) }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-card via-card/80 to-transparent pointer-events-none" />
          </div>

          {/* ── Asking price — revealed at bottom ──────────────────── */}
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
              Očekivana cijena
            </p>
            <p className="text-3xl font-heading font-bold text-foreground tabular-nums">
              {formatCurrency(askingPrice)}
            </p>
          </div>
        </CardContent>

        {/* ── Differentiated CTAs ────────────────────────────────────── */}
        <CardFooter className="pt-5 pb-6 px-6 border-t border-border bg-muted/10 flex gap-3 mt-auto">
          {/* Secondary — browse the teaser */}
          <Link href={`/listings/${publicCode}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full h-11 rounded-none text-muted-foreground hover:text-foreground border-border hover:border-foreground/30 transition-colors"
            >
              Pregledaj teaser
            </Button>
          </Link>

          {/* Primary — request NDA access (gold-accented) */}
          <Link href={`/listings/${publicCode}`} className="flex-1">
            <Button
              className="w-full h-11 rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90 shadow-[0_0_16px_rgba(21,101,192,0.2)] hover:shadow-[0_0_32px_rgba(21,101,192,0.5)] transition-all duration-300 font-bold tracking-wide"
            >
              <Lock className="w-4 h-4 mr-2 shrink-0" />
              NDA pristup
              <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
            </Button>
          </Link>
        </CardFooter>
      </GlowCard>
    </motion.div>
  );
}
