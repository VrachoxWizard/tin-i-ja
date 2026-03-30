"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileText, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { sanitizeHtml } from "@/lib/sanitize";

interface NdaRequest {
  id: string;
  status: string;
  created_at: string;
  buyerName: string;
}

interface SellerDashboardContentProps {
  listing: {
    blind_teaser: string | null;
  } | null;
  ndaList: NdaRequest[];
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
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export function SellerDashboardContent({
  listing,
  ndaList,
}: SellerDashboardContentProps) {
  const stats = [
    {
      label: "Pregledi Teasera",
      value: 0,
      placeholder: true,
      icon: Eye,
      gradient: "from-indigo-500/20 to-blue-500/10",
      iconColor: "text-indigo-400",
    },
    {
      label: "Algoritamska Uparivanja",
      value: 0,
      placeholder: true,
      icon: CheckCircle,
      gradient: "from-emerald-500/20 to-green-500/10",
      iconColor: "text-emerald-400",
    },
    {
      label: "NDA Zahtjevi",
      value: ndaList.length,
      placeholder: false,
      icon: FileText,
      gradient: "from-gold/20 to-amber-500/10",
      iconColor: "text-gold",
      highlight: true,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 w-full py-12 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-trust/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          className="container mx-auto px-4 max-w-6xl relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold text-white font-heading tracking-tight mb-8"
          >
            Nadzorna Ploča{" "}
            <span className="text-slate-400 font-heading text-xl ml-2 font-normal">
              (Prodavatelj)
            </span>
          </motion.h1>

          {/* Stat Cards — Bento Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <GlowCard
                  className={`border-white/[0.06] bg-card/80 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden hover:shadow-glass-elevated transition-all group ${stat.highlight ? "ring-1 ring-trust/10" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle
                      className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${stat.highlight ? "text-trust" : "text-slate-400"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-linear-to-br ${stat.gradient} flex items-center justify-center transition-colors`}
                      >
                        <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                      </div>
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-4xl font-bold font-heading tracking-tight ${stat.highlight ? "text-gold" : "text-white"}`}
                    >
                      {stat.placeholder ? (
                        "—"
                      ) : (
                        <AnimatedCounter value={stat.value} />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.placeholder
                        ? "Podaci uskoro dostupni"
                        : ndaList.length === 0
                          ? "Nema novih zahtjeva"
                          : "Aktivnih zahtjeva"}
                    </p>
                  </CardContent>
                </GlowCard>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Listing Management */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              <GlowCard className="border-white/[0.06] bg-card/80 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden">
                <div className="h-1 bg-linear-to-r from-trust via-df-navy to-gold" />
                <CardHeader className="bg-white/[0.02] border-b border-white/[0.06] px-6 py-5">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-white font-heading">
                      Moj Aktivni Oglas
                    </CardTitle>
                    {listing ? (
                      <Badge className="bg-emerald-900/30 text-emerald-400 border-none">
                        Aktivno
                      </Badge>
                    ) : (
                      <Badge className="bg-white/[0.06] text-slate-400 border-none">
                        Nema Oglasa
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-slate-400 mt-1">
                    Ovo je slijepi teaser koji kupci trenutno vide.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {listing ? (
                    <>
                      <div className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl text-slate-300 text-sm mb-5 shadow-sm line-clamp-6 leading-relaxed relative backdrop-blur-sm">
                        <div className="absolute top-0 right-0 bg-linear-to-l from-card w-12 h-full pointer-events-none" />
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              listing.blind_teaser ||
                              "Nema generiranog teasera."
                            ),
                          }}
                        />
                      </div>
                      <Link href="/listings">
                        <Button
                          variant="outline"
                          className="rounded-xl border-white/[0.08] hover:bg-white/[0.03] h-10 px-5"
                        >
                          <Eye className="w-4 h-4 mr-2 text-slate-400" />{" "}
                          Pregledaj kao investitor
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-white/[0.02] rounded-xl border border-dashed border-white/[0.08]">
                      <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-300 mb-4">
                        Još niste kreirali oglas.
                      </p>
                      <Link href="/sell">
                        <Button
                          variant="premium"
                          className="rounded-xl shadow-md h-10 px-6"
                        >
                          Započni proces valuacije
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </GlowCard>
            </motion.div>

            {/* NDA Requests */}
            <motion.div variants={itemVariants} className="space-y-6">
              <GlowCard className="border-white/[0.06] bg-card/80 backdrop-blur-xl shadow-glass rounded-2xl overflow-hidden">
                <CardHeader className="bg-white/[0.02] border-b border-white/[0.06] px-6 py-5">
                  <CardTitle className="text-xl text-white font-heading">
                    NDA Pristigli Zahtjevi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {ndaList.length === 0 ? (
                    <div className="text-center py-10 bg-white/[0.02] rounded-xl border border-dashed border-white/[0.08]">
                      <CheckCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        Trenutno nema novih zahtjeva.
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      variants={ndaStaggerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      {ndaList.map((req) => (
                        <motion.div
                          key={req.id}
                          variants={ndaItemVariants}
                          className={`p-5 border rounded-xl bg-white/[0.02] hover:bg-white/[0.04] shadow-sm hover:shadow-glass transition-all flex flex-col gap-4 ${
                            req.status === "pending"
                              ? "border-white/[0.06] shadow-[inset_4px_0_0_theme(--color-gold)]"
                              : "border-white/[0.06]"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <p className="font-bold text-sm text-white font-heading mb-1">
                                {req.buyerName}
                              </p>
                              <p className="text-xs text-slate-400 flex items-center">
                                <Clock className="w-3 h-3 mr-1 opacity-70" />{" "}
                                {new Date(req.created_at).toLocaleDateString(
                                  "hr-HR",
                                )}
                              </p>
                            </div>
                            {req.status === "pending" ? (
                              <Badge
                                variant="outline"
                                className="bg-amber-900/20 text-amber-400 border-amber-800/50 font-medium whitespace-nowrap"
                              >
                                Na čekanju
                              </Badge>
                            ) : req.status === "signed" ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-900/20 text-emerald-400 border-emerald-800/50 font-medium whitespace-nowrap"
                              >
                                Odobreno
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-red-900/20 text-red-400 border-red-800/50 font-medium whitespace-nowrap"
                              >
                                Odbijeno
                              </Badge>
                            )}
                          </div>

                          {req.status === "pending" && (
                            <div className="flex gap-2 mt-1">
                              <motion.div
                                className="flex-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                <Button
                                  size="sm"
                                  variant="premium"
                                  className="w-full rounded-lg h-9 shadow-sm"
                                >
                                  Odobri
                                </Button>
                              </motion.div>
                              <motion.div
                                className="flex-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full text-red-400 border-red-800/50 hover:bg-red-900/20 rounded-lg h-9"
                                >
                                  Odbij
                                </Button>
                              </motion.div>
                            </div>
                          )}
                          {req.status === "signed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full rounded-lg border-white/[0.08] hover:bg-white/[0.03] h-9"
                            >
                              <FileText className="w-3.5 h-3.5 mr-2 text-slate-400" />{" "}
                              Otvori Deal Room
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </GlowCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
