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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <GlowCard className="flex flex-col h-full border border-border bg-card/90 shadow-sm hover:shadow-lg transition-shadow rounded-none overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-df-trust-blue via-primary to-df-trust-blue" />

        <CardHeader className="pb-4 pt-8 px-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <Badge
              variant="outline"
              className="bg-muted text-muted-foreground border-border font-medium px-3 py-1 rounded-none tracking-wide text-xs"
            >
              Šifra {publicCode}
            </Badge>
            {isVerified ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-none">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                Verificirano
              </Badge>
            ) : null}
          </div>

          <h3 className="text-2xl font-heading font-semibold text-foreground leading-tight">
            Tvrtka u sektoru {industry}
          </h3>

          <div className="flex items-center text-muted-foreground text-sm mt-3">
            <MapPin className="w-4 h-4 mr-2 text-df-trust-blue" />
            {region}
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-6 px-6">
          <div className="grid grid-cols-2 gap-4 p-5 border border-border bg-muted/30 rounded-none">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                Prihod
              </div>
              <p className="text-lg font-heading font-semibold text-foreground">
                {formatCurrency(revenue)}
              </p>
            </div>

            <div className="space-y-1 border-l border-border pl-4">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                EBITDA
              </div>
              <p className="text-lg font-heading font-semibold text-foreground">
                {formatCurrency(ebitda)}
              </p>
            </div>
          </div>

          <div className="relative">
            <div
              className="text-sm text-muted-foreground space-y-2 line-clamp-5 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(blindTeaserHtml) }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-linear-to-t from-card via-card/85 to-transparent pointer-events-none" />
          </div>

          <div className="pt-2 flex items-end justify-between border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Očekivana cijena
              </p>
              <p className="text-2xl font-heading font-semibold text-primary">
                {formatCurrency(askingPrice)}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-5 pb-6 px-6 border-t border-border bg-muted/20 flex gap-3 mt-auto">
          <Link href={`/listings/${publicCode}`} className="flex-1">
            <Button variant="outline" className="w-full h-11 rounded-none">
              Otvori teaser
            </Button>
          </Link>
          <Link href={`/listings/${publicCode}`} className="flex-1">
            <Button className="w-full h-11 rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90">
              <Lock className="w-4 h-4 mr-2" />
              NDA pristup
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </GlowCard>
    </motion.div>
  );
}
