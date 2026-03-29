"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Shield,
  Users,
  Lock,
  Quote,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { AmbientBackground } from "@/components/ui/AmbientBackground";

/* ─── Scroll-triggered animated counter with suffix ─── */
function AnimatedCounter({
  value,
  suffix = "+",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp: number | null = null;
    const duration = 2000;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value, isInView]);

  return (
    <div ref={ref} className="flex flex-col items-center py-2">
      <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 tabular-nums">
        {count}
        {suffix}
      </div>
      <div className="text-sm font-sans text-slate-400 uppercase tracking-wider text-center">
        {label}
      </div>
    </div>
  );
}

/* ─── Animation Variants ─── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ─── Process steps ─── */
const processSteps = [
  {
    icon: BarChart3,
    title: "Procjena",
    desc: "AI valuator analizira vašu tvrtku",
    accent: "trust",
  },
  {
    icon: Shield,
    title: "Teaser",
    desc: "Generiramo anonimni blind teaser",
    accent: "gold",
  },
  {
    icon: Users,
    title: "Uparivanje",
    desc: "Algoritam pronalazi idealne kupce",
    accent: "indigo",
  },
  {
    icon: Lock,
    title: "NDA & Deal",
    desc: "Sigurno povezivanje i pregovaranje",
    accent: "emerald",
  },
];

/* ─── Testimonials ─── */
const testimonials = [
  {
    quote:
      "DealFlow nam je pomogao pronaći idealnog kupca u roku od 3 mjeseca. Proces je bio potpuno diskretan.",
    name: "Marko H.",
    role: "Vlasnik IT tvrtke, Zagreb",
  },
  {
    quote:
      "Procjena vrijednosti bila je precizna i profesionalna. Preporučujem svima koji razmišljaju o prodaji.",
    name: "Ana K.",
    role: "Vlasnica proizvodnog pogona, Split",
  },
  {
    quote:
      "Kao investitor, DealFlow mi pruža pristup kvalitetnim prilikama koje ne bih pronašao nigdje drugdje.",
    name: "Ivan M.",
    role: "Strateški investitor, Rijeka",
  },
];

/* ─── SVG Process Line (Framer Motion pathLength) ─── */
function ProcessLine() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <svg
      ref={ref}
      className="absolute top-8 left-[12.5%] w-[75%] h-0.5 hidden md:block z-0"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="processGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
      <motion.line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke="url(#processGrad)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-950 text-foreground overflow-x-hidden selection:bg-gold/30 selection:text-white">
      {/* Cinematic Editorial Hero Section */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center overflow-hidden bg-slate-950 w-full">
        {/* Left Column: Editorial Typography */}
        <div className="relative w-full lg:w-[55%] min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-32 pb-24 lg:py-0 z-20">
          <AmbientBackground /> {/* Scoped background effects */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-start mb-8 relative z-10"
          >
            <div className="relative group cursor-default">
              <div className="absolute -inset-0.5 bg-linear-to-r from-gold/50 via-trust/50 to-gold/50 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-1000" />
              <span className="relative px-6 py-2.5 rounded-full bg-navy/80 border border-white/10 text-slate-200 text-sm font-medium tracking-widest uppercase backdrop-blur-xl shadow-2xl flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                Prva Premium M&A Platforma
              </span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -40, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[6.5rem] font-heading font-extrabold tracking-[-0.03em] text-white mb-8 max-w-4xl leading-[1.05] relative z-10"
          >
            Zaključite pravu <br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-gold via-yellow-200 to-gold bg-size-[200%_auto]">
                budućnost
              </span>
              <span className="absolute inset-0 bg-gold blur-[60px] opacity-20 z-0" />
            </span>{" "}
            <br className="hidden lg:block" /> vaše tvrtke.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl leading-relaxed font-light relative z-10"
          >
            Ekskluzivna mreža koja spaja vlasnike d.o.o. tvrtki s kvalificiranim
            investitorima. Pametna procjena, diskretni teaseri i sigurno
            spajanje—bez trenja.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-start gap-5 relative z-20"
          >
            <Link href="/valuate" className="w-full sm:w-auto relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-gold to-trust rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500 group-hover:duration-200" />
              <Button className="btn-shimmer relative w-full h-16 bg-gold text-navy hover:bg-gold/90 rounded-full font-heading px-10 border-none text-[17px] tracking-wide font-bold overflow-hidden transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                <span className="relative z-10 flex items-center">
                  Procijeni vrijednost
                  <ArrowRight className="ml-3 size-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
            </Link>

            <Link href="/listings" className="w-full sm:w-auto mt-4 sm:mt-0">
              <Button
                variant="outline"
                className="w-full h-16 bg-navy/50 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-full font-heading px-10 transition-all text-[17px] tracking-wide font-medium"
              >
                Pregledaj prilike
              </Button>
            </Link>
          </motion.div>
          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center gap-6 mt-12 relative z-10"
          >
            {[
              { icon: "🔒", text: "GDPR" },
              { icon: "🇭🇷", text: "Hrvatska" },
              { icon: "⚡", text: "AI-Powered" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <span className="w-px h-3 bg-white/10 -ml-3" />}
                <span className="text-sm">{badge.icon}</span>
                <span className="text-slate-500 text-xs uppercase tracking-widest font-sans">
                  {badge.text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Unsplash Corporate Image + Cinematic Gradients */}
        <div className="hidden lg:block absolute right-0 top-0 w-[55%] h-full z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Corporate skyline"
            fill
            unoptimized
            className="object-cover scale-105 opacity-50"
            priority
          />
          {/* Cinematic gradient overlays */}
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/60 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/40 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-slate-950/20 z-10 pointer-events-none" />

          {/* Mesh grid overlay for texture */}
          <div
            className="absolute inset-0 opacity-[0.04] z-20 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />

          {/* Subtle golden accent orb for depth */}
          <div className="absolute top-[30%] right-[20%] w-100 h-100 rounded-full bg-gold/10 blur-[100px] z-20 pointer-events-none animate-[hero-orb-1_12s_ease-in-out_infinite]" />
        </div>
      </section>

      {/* Stats Section Floating Glass */}
      <section className="relative z-30 -mt-24 mx-4 md:mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative py-12 md:py-16 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden"
        >
          {/* Subtle noise inside the glass card */}
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

          <div className="flex flex-wrap justify-evenly items-center relative z-10 px-6 md:px-12">
            <AnimatedCounter value={150} label="Kupaca" />
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <AnimatedCounter value={45} label="Tvrtki" />
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <AnimatedCounter value={12} label="Transakcija" />
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <AnimatedCounter
              value={30}
              suffix="M €"
              label="Ukupna Vrijednost"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6 tracking-tight leading-tight"
          >
            Institucionalna kvaliteta. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-trust via-blue-400 to-indigo-300">
              Tehnološka preciznost.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xl font-light max-w-3xl mx-auto leading-relaxed"
          >
            DealFlow koristi algoritme, sigurne data-sobe i stroga pravila
            privatnosti kako bi osigurao optimalan ishod svake transakcije na
            hrvatskom tržištu.
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-162.5"
        >
          {/* Feature 1: Large Card (Spans 2 columns) */}
          <motion.div
            variants={fadeUpItem}
            className="md:col-span-2 md:row-span-1 border border-white/10 rounded-[2rem] p-10 shadow-2xl hover:border-trust/30 hover:-translate-y-1 transition-all duration-500 overflow-hidden relative group"
          >
            {/* Rich Media Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                alt="Data Analytics"
                fill
                unoptimized
                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[10s] opacity-50 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/90 to-slate-900/60 z-10" />
            </div>

            <div className="absolute -top-40 -right-40 w-100 h-100 bg-trust/20 rounded-full blur-[100px] group-hover:bg-trust/40 group-hover:scale-150 transition-all duration-1000 z-0" />

            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="size-16 rounded-2xl bg-trust/20 border border-trust/30 text-blue-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.3)] backdrop-blur-md group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-500">
                <BarChart3 className="size-8" />
              </div>
              <div className="max-w-xl">
                <h3 className="font-heading text-2xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-none group-hover:text-blue-100 transition-colors">
                  AI Valuator Tvrtke
                </h3>
                <p className="text-slate-300 font-sans text-lg font-light leading-relaxed">
                  Naš napredni model algoritamski analizira vaše financijske
                  pokazatelje, uspoređujući ih s recentnim EU transakcijama za
                  instant i sigurnu procjenu tržišnih multiplikatora.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Tall Card (Spans 2 rows) */}
          <motion.div
            variants={fadeUpItem}
            className="md:col-span-1 md:row-span-2 border border-white/10 rounded-[2rem] p-10 shadow-2xl hover:border-gold/30 hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative flex flex-col"
          >
            {/* Rich Media Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                alt="Privacy and Security"
                fill
                unoptimized
                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[15s] opacity-60 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />
              <div className="absolute inset-0 bg-slate-950/40 z-10" />
            </div>

            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full h-[50%] bg-gold/20 rounded-[100%] blur-[80px] group-hover:bg-gold/40 transition-colors duration-1000 z-10 pointer-events-none" />

            <div className="relative z-20 h-full flex flex-col">
              <div className="size-16 rounded-2xl bg-gold/20 border border-gold/40 text-gold flex items-center justify-center mb-8 mt-auto lg:mt-0 shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-500 backdrop-blur-md">
                <Shield className="size-8" />
              </div>
              <div className="mt-auto pt-10 border-t border-white/20">
                <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight group-hover:text-yellow-100 transition-colors">
                  Blind Teasers
                </h3>
                <p className="text-slate-300 font-sans text-lg font-light leading-relaxed">
                  Vaš identitet ostaje apsolutno skriven. Akviziteri inicijalno
                  vide isključivo anonimni &quot;Blind Teaser&quot; s robusnim
                  financijskim modelom i industrijskim pregledom.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature 3: Small Card */}
          <motion.div
            variants={fadeUpItem}
            className="md:col-span-1 md:row-span-1 border border-white/10 rounded-[2rem] p-8 shadow-2xl hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group"
          >
            {/* Rich Media Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                alt="Network Connections"
                fill
                unoptimized
                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[10s] opacity-40 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-slate-950/70 z-10" />
            </div>

            <div className="absolute -bottom-20 -left-20 w-75 h-75 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-400/40 group-hover:scale-125 transition-all duration-1000 z-10" />

            <div className="relative z-20 flex flex-col h-full justify-center">
              <div className="size-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center mb-5 backdrop-blur-md group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-500">
                <Users className="size-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3 tracking-tight">
                Pametno Spajanje
              </h3>
              <p className="text-slate-300 font-sans font-light leading-relaxed">
                Strojno ubrzano mapiranje strateških preuzimatelja na temelju
                likvidnosti.
              </p>
            </div>
          </motion.div>

          {/* Feature 4: Small Card */}
          <motion.div
            variants={fadeUpItem}
            className="md:col-span-1 md:row-span-1 border border-white/10 rounded-[2rem] p-8 shadow-2xl hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group"
          >
            {/* Rich Media Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1633265486064-086b219458ce?q=80&w=2070&auto=format&fit=crop"
                alt="Secure Operations"
                fill
                unoptimized
                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[10s] opacity-40 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-slate-950/70 z-10" />
            </div>

            <div className="absolute -top-20 right-0 w-62.5 h-62.5 bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-400/40 group-hover:scale-125 transition-all duration-1000 z-10" />

            <div className="relative z-20 flex flex-col h-full justify-center">
              <div className="size-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center mb-5 backdrop-blur-md group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-500">
                <Lock className="size-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3 tracking-tight">
                Puni NDA Proces
              </h3>
              <p className="text-slate-300 font-sans font-light leading-relaxed">
                Besprijekoran digitalni potpis NDA uz punu pravnu zaštitu EU
                propisa.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ KAKO FUNKCIONIRA ═══════════════════ */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-gold text-sm font-semibold uppercase tracking-widest font-sans mb-4 block">
              Proces
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6 tracking-tight">
              Kako funkcionira
            </h2>
            <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto">
              Četiri koraka od procjene do uspješne transakcije.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Animated connecting line — Desktop horizontal */}
          <ProcessLine />

          {/* Vertical line — Mobile */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-gold/40 via-trust/40 to-gold/40 md:hidden z-0" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10"
          >
            {processSteps.map((step, i) => {
              const accentMap: Record<
                string,
                { bg: string; border: string; text: string; shadow: string }
              > = {
                trust: {
                  bg: "bg-trust/20",
                  border: "border-trust/30",
                  text: "text-blue-400",
                  shadow: "shadow-[0_0_20px_rgba(37,99,235,0.2)]",
                },
                gold: {
                  bg: "bg-gold/20",
                  border: "border-gold/40",
                  text: "text-gold",
                  shadow: "shadow-[0_0_20px_rgba(212,175,55,0.2)]",
                },
                indigo: {
                  bg: "bg-indigo-500/20",
                  border: "border-indigo-500/40",
                  text: "text-indigo-300",
                  shadow: "shadow-[0_0_20px_rgba(99,102,241,0.2)]",
                },
                emerald: {
                  bg: "bg-emerald-500/20",
                  border: "border-emerald-500/40",
                  text: "text-emerald-300",
                  shadow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
                },
              };
              const a = accentMap[step.accent];
              return (
                <motion.div
                  key={i}
                  variants={fadeUpItem}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <div
                      className={`size-16 rounded-2xl ${a.bg} ${a.border} border ${a.text} ${a.shadow} flex items-center justify-center backdrop-blur-md`}
                    >
                      <step.icon className="size-7" />
                    </div>
                    <div className="absolute -top-2 -right-2 size-6 rounded-full bg-slate-950 border-2 border-gold text-gold text-[10px] font-bold flex items-center justify-center font-heading">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 font-sans text-sm font-light leading-relaxed max-w-50">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-gold text-sm font-semibold uppercase tracking-widest font-sans mb-4 block">
              Iskustva
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-6 tracking-tight">
              Što kažu naši klijenti
            </h2>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUpItem}
              className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:-translate-y-1 transition-all duration-500 group"
            >
              <Quote className="size-8 text-gold/30 mb-4" />
              <p className="text-slate-300 font-sans text-base leading-relaxed mb-8 font-light">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="size-10 rounded-full bg-linear-to-br from-gold/30 to-trust/30 flex items-center justify-center text-white font-heading font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-heading font-semibold text-sm">
                    {t.name}
                  </div>
                  <div className="text-slate-500 text-xs font-sans">
                    {t.role}
                  </div>
                </div>
              </div>
              {/* Star rating */}
              <div className="absolute top-8 right-8 flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <svg
                    key={j}
                    className="size-3 text-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="relative py-48 md:py-64 overflow-hidden z-10 w-full flex items-center justify-center">
        {/* Luxury Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950 z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-125 bg-linear-to-r from-gold/10 via-trust/10 to-gold/10 blur-[120px] opacity-60 z-0 animate-[hero-orb-1_15s_ease-in-out_infinite]" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center relative"
          >
            {/* Social proof line */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-slate-500 text-sm uppercase tracking-widest font-sans mb-8"
            >
              Više od 150 tvrtki i investitora koristi DealFlow
            </motion.p>

            <h2 className="font-heading text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[1.1]">
              Sljedeći korak je <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-gold to-yellow-200">
                na vama.
              </span>
            </h2>
            <p className="text-slate-400 text-xl md:text-3xl font-light mb-16 max-w-2xl mx-auto leading-relaxed">
              Pridružite se ekskluzivnom krugu tvrtki i investitora koji
              mijenjaju landscape regije.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="btn-shimmer w-full sm:w-auto h-20 px-16 text-2xl rounded-full bg-white text-slate-950 hover:bg-slate-200 font-bold border-none shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-500"
                >
                  Započnite proces
                </Button>
              </Link>
              <Link href="/listings">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-20 px-12 text-xl rounded-full bg-transparent border border-white/15 text-white hover:bg-white/10 hover:border-white/25 font-medium transition-all duration-500"
                >
                  Saznajte više
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
