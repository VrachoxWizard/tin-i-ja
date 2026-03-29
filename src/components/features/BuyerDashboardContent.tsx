"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  Building2,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface NdaItem {
  id: string;
  status: string;
  created_at: string;
  listing_id: string;
  industry: string;
}

interface BuyerDashboardContentProps {
  userName: string;
  userEmail: string;
  ndaList: NdaItem[];
}

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 100, damping: 30 });

  useEffect(() => {
    mv.set(value);
  }, [mv, value]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toString();
    });
  }, [spring]);

  return <span ref={ref}>0</span>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

const ndaStaggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const ndaItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export function BuyerDashboardContent({
  userName,
  userEmail,
  ndaList,
}: BuyerDashboardContentProps) {
  const signedCount = ndaList.filter((n) => n.status === "signed").length;
  const pendingCount = ndaList.filter((n) => n.status === "pending").length;
  const totalCount = ndaList.length;

  const metrics = [
    {
      label: "Ukupni NDA",
      value: totalCount,
      icon: FileText,
      gradient: "from-trust/20 to-blue-500/10",
      iconColor: "text-trust",
    },
    {
      label: "Na Čekanju",
      value: pendingCount,
      icon: Clock,
      gradient: "from-amber-500/20 to-orange-500/10",
      iconColor: "text-amber-400",
    },
    {
      label: "Odobreni NDA",
      value: signedCount,
      icon: CheckCircle,
      gradient: "from-emerald-500/20 to-green-500/10",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 w-full py-12 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-trust/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          className="container mx-auto px-4 max-w-6xl relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <h1 className="text-3xl font-bold text-white font-heading tracking-tight">
              Nadzorna Ploča{" "}
              <span className="text-trust font-heading opacity-80 text-xl ml-2 font-normal">
                (Investitor)
              </span>
            </h1>
            <Link href="/listings">
              <Button
                variant="premium"
                className="rounded-xl shadow-md h-11 px-6"
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Pretraži Tržište
              </Button>
            </Link>
          </motion.div>

          {/* Metric Cards — Bento Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {metrics.map((metric) => (
              <motion.div key={metric.label} variants={itemVariants}>
                <GlowCard className="border-white/[0.06] bg-card/80 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden hover:shadow-glass-elevated transition-all group">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg bg-linear-to-br ${metric.gradient} flex items-center justify-center transition-colors`}
                      >
                        <metric.icon
                          className={`w-4 h-4 ${metric.iconColor}`}
                        />
                      </div>
                      {metric.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-white font-heading tracking-tight">
                      <AnimatedCounter value={metric.value} />
                    </div>
                  </CardContent>
                </GlowCard>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* NDA Status List */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <GlowCard className="border-white/[0.06] bg-card/80 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden">
                <div className="h-1 bg-linear-to-r from-trust via-df-navy to-gold" />
                <CardHeader className="bg-white/[0.02] border-b border-white/[0.06] px-6 py-5">
                  <CardTitle className="text-xl text-white font-heading">
                    Statusi NDA Zahtjeva
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Pratite napredak vaših zahtjeva za otkrivanje punih
                    informacija o tvrtkama.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {ndaList.length === 0 ? (
                    <div className="text-center py-10 bg-white/[0.02] rounded-xl border border-dashed border-white/[0.08]">
                      <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">
                        Nemate još poslani NDA zahtjev.
                      </p>
                      <Link
                        href="/listings"
                        className="text-trust hover:text-trust/80 font-semibold hover:underline mt-2 inline-block"
                      >
                        Zatražite prvi.
                      </Link>
                    </div>
                  ) : (
                    <motion.div
                      variants={ndaStaggerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      {ndaList.map((nda) => (
                        <motion.div
                          key={nda.id}
                          variants={ndaItemVariants}
                          className="flex flex-col sm:flex-row justify-between items-center p-4 border border-white/[0.06] rounded-xl bg-white/[0.02] hover:bg-white/[0.04] shadow-sm hover:shadow-glass transition-all gap-4 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-400 group-hover:bg-trust/10 group-hover:text-trust transition-colors">
                              <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-bold text-white font-heading">
                                Tvrtka #{nda.listing_id.split("-")[0]}
                              </p>
                              <p className="text-sm text-slate-400">
                                {nda.industry}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            {nda.status === "pending" ? (
                              <Badge
                                variant="outline"
                                className="bg-amber-900/20 text-amber-400 border-amber-800/50 font-medium px-3 py-1 flex gap-1.5"
                              >
                                <Clock className="w-3.5 h-3.5" /> Na čekanju
                              </Badge>
                            ) : nda.status === "signed" ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-900/20 text-emerald-400 border-emerald-800/50 font-medium px-3 py-1 flex gap-1.5"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Odobreno
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-red-900/20 text-red-400 border-red-800/50 font-medium px-3 py-1 flex gap-1.5"
                              >
                                Odbijeno
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant={
                                nda.status === "signed" ? "premium" : "outline"
                              }
                              className={`rounded-lg font-heading h-9 ${nda.status !== "signed" ? "border-white/[0.08] bg-transparent text-slate-400" : ""}`}
                              disabled={nda.status !== "signed"}
                            >
                              {nda.status === "signed"
                                ? "Otvori Deal Room"
                                : "Zatraženo"}
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </GlowCard>
            </motion.div>

            {/* Profile Card */}
            <motion.div variants={itemVariants} className="space-y-6">
              <GlowCard className="border-white/[0.06] bg-card/80 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden">
                <CardHeader className="bg-white/[0.02] border-b border-white/[0.06] px-6 py-5">
                  <CardTitle className="text-xl text-white font-heading">
                    Moj Profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5 text-sm">
                  {/* Avatar with gradient glow ring */}
                  <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-linear-to-br from-trust to-gold rounded-full blur-sm opacity-60" />
                      <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-trust to-blue-700 flex items-center justify-center text-white font-heading text-xl font-bold shadow-lg">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-white font-heading">
                        {userName}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[170px]">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                    <span className="text-slate-400">Aktivni NDA</span>
                    <span className="font-semibold text-white">
                      {signedCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-400">Status verifikacije</span>
                    <Badge className="bg-emerald-900/30 text-emerald-400 border-none">
                      Verificiran
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="bg-white/[0.01] px-6 py-4 border-t border-white/[0.06]">
                  <Button
                    variant="outline"
                    className="w-full font-heading rounded-xl border-white/[0.08] hover:bg-white/[0.03] transition-colors"
                  >
                    Postavke Profila
                  </Button>
                </CardFooter>
              </GlowCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
