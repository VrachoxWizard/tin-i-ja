'use client'

import Image from "next/image";
import Link from 'next/link';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Shield, Users, Lock } from "lucide-react";
import { useState, useEffect } from "react";

import { AmbientBackground } from "@/components/ui/AmbientBackground";

// Animated counter component
function AnimatedCounter({ value, label }: { value: number, label: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Use easeOutQuart easing for smoother decelleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-4xl md:text-5xl font-heading font-bold text-navy mb-2">{count}+</div>
      <div className="text-sm font-sans text-slate-500 uppercase tracking-wider text-center">{label}</div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-background text-foreground overflow-x-hidden selection:bg-gold/30 selection:text-white">
      {/* Cinematic Editorial Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col lg:flex-row items-center overflow-hidden bg-slate-950 w-full">
        
        {/* Left Column: Editorial Typography */}
        <div className="relative w-full lg:w-[55%] min-h-[100vh] flex flex-col justify-center px-6 sm:px-12 lg:px-20 pt-32 pb-24 lg:py-0 z-20">
          <AmbientBackground /> {/* Scoped background effects */}
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-start mb-8 relative z-10"
          >
            <div className="relative group cursor-default">
              <div className="absolute inset-[-2px] bg-gradient-to-r from-gold/50 via-trust/50 to-gold/50 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-1000" />
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
            Zaključite pravu <br className="hidden md:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold bg-[length:200%_auto]">
                budućnost
              </span>
              <span className="absolute inset-0 bg-gold blur-[60px] opacity-20 z-0" />
            </span> <br className="hidden lg:block"/> vaše tvrtke.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl leading-relaxed font-light relative z-10"
          >
            Ekskluzivna mreža koja spaja vlasnike d.o.o. tvrtki s kvalificiranim investitorima. Pametna procjena, diskretni teaseri i sigurno spajanje—bez trenja.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-start gap-5 relative z-20"
          >
            <Link href="/valuate" className="w-full sm:w-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold to-trust rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500 group-hover:duration-200" />
              <Button className="relative w-full h-16 bg-white text-navy hover:bg-slate-50 rounded-full font-heading px-10 border-none text-[17px] tracking-wide font-bold overflow-hidden transition-all">
                 <span className="relative z-10 flex items-center">
                    Procijeni vrijednost
                    <ArrowRight className="ml-3 size-5 group-hover:translate-x-2 transition-transform duration-300" />
                 </span>
              </Button>
            </Link>
            
            <Link href="/listings" className="w-full sm:w-auto mt-4 sm:mt-0">
              <Button variant="outline" className="w-full h-16 bg-navy/50 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-full font-heading px-10 transition-all text-[17px] tracking-wide font-medium">
                Pregledaj prilike
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Rich Media (Full Bleed Video) */}
        <div className="hidden lg:block absolute right-0 top-0 w-[55%] h-full z-0 overflow-hidden">
           {/* Shadow gradient to blend the video into the dark background naturally */}
           <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-10 pointers-events-none" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 z-10 pointers-events-none" />
           
           <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
           >
              <source src="https://cdn.coverr.co/videos/coverr-abstract-golden-lines-and-particles-4422/1080p.mp4" type="video/mp4" />
           </video>
        </div>
      </section>

      {/* Stats Section Floating Glass */}
      <section className="relative z-30 -mt-24 mx-4 md:mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative py-12 md:py-16 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden"
        >
          {/* Subtle noise inside the glass card */}
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-12 relative z-10">
            <AnimatedCounter value={150} label="Kupaca" />
            <AnimatedCounter value={45} label="Tvrtki" />
            <AnimatedCounter value={12} label="Transakcija" />
            <AnimatedCounter value={30} label="Milijuna €" />
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
            Institucionalna kvaliteta. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust via-blue-400 to-indigo-300">Tehnološka preciznost.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xl font-light max-w-3xl mx-auto leading-relaxed"
          >
            DealFlow koristi algoritme, sigurne data-sobe i stroga pravila privatnosti kako bi osigurao optimalan ishod svake transakcije na hrvatskom tržištu.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[650px]">
          
          {/* Feature 1: Large Card (Spans 2 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="md:col-span-2 md:row-span-1 border border-white/10 rounded-[2rem] p-10 shadow-2xl hover:border-white/20 transition-all duration-500 overflow-hidden relative group"
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
               <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/60 z-10" />
            </div>
            
            <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-trust/20 rounded-full blur-[100px] group-hover:bg-trust/40 group-hover:scale-150 transition-all duration-1000 z-0" />
            
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="size-16 rounded-2xl bg-trust/20 border border-trust/30 text-blue-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.3)] backdrop-blur-md">
                <BarChart3 className="size-8" />
              </div>
              <div className="max-w-xl">
                <h3 className="font-heading text-2xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-none group-hover:text-blue-100 transition-colors">AI Valuator Tvrtke</h3>
                <p className="text-slate-300 font-sans text-lg font-light leading-relaxed">
                  Naš napredni model algoritamski analizira vaše financijske pokazatelje, uspoređujući ih s recentnim EU transakcijama za instant i sigurnu procjenu tržišnih multiplikatora.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Tall Card (Spans 2 rows) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 md:row-span-2 border border-white/10 rounded-[2rem] p-10 shadow-2xl hover:border-gold/30 transition-all duration-500 group overflow-hidden relative flex flex-col"
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
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10" />
               <div className="absolute inset-0 bg-slate-950/40 z-10" />
            </div>
            
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full h-[50%] bg-gold/20 rounded-[100%] blur-[80px] group-hover:bg-gold/40 transition-colors duration-1000 z-10 pointer-events-none" />

            <div className="relative z-20 h-full flex flex-col">
              <div className="size-16 rounded-2xl bg-gold/20 border border-gold/40 text-gold flex items-center justify-center mb-8 mt-auto lg:mt-0 shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-shadow duration-500 backdrop-blur-md">
                <Shield className="size-8" />
              </div>
              <div className="mt-auto pt-10 border-t border-white/20">
                <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight group-hover:text-yellow-100 transition-colors">Blind Teasers</h3>
                <p className="text-slate-300 font-sans text-lg font-light leading-relaxed">
                  Vaš identitet ostaje apsolutno skriven. Akviziteri inicijalno vide isključivo anonimni &quot;Blind Teaser&quot; s robusnim financijskim modelom i industrijskim pregledom.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feature 3: Small Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 md:row-span-1 border border-white/10 rounded-[2rem] p-8 shadow-2xl hover:border-white/20 transition-all duration-500 relative overflow-hidden group"
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

             <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-400/40 group-hover:scale-125 transition-all duration-1000 z-10" />
            
            <div className="relative z-20 flex flex-col h-full justify-center">
              <div className="size-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center mb-5 backdrop-blur-md">
                <Users className="size-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3 tracking-tight">Pametno Spajanje</h3>
              <p className="text-slate-300 font-sans font-light leading-relaxed">
                Strojno ubrzano mapiranje strateških preuzimatelja na temelju likvidnosti.
              </p>
            </div>
          </motion.div>

          {/* Feature 4: Small Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.4 }}
            className="md:col-span-1 md:row-span-1 border border-white/10 rounded-[2rem] p-8 shadow-2xl hover:border-white/20 transition-all duration-500 relative overflow-hidden group"
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

            <div className="absolute -top-20 right-0 w-[250px] h-[250px] bg-emerald-500/20 rounded-full blur-[80px] group-hover:bg-emerald-400/40 group-hover:scale-125 transition-all duration-1000 z-10" />

            <div className="relative z-20 flex flex-col h-full justify-center">
               <div className="size-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center mb-5 backdrop-blur-md">
                <Lock className="size-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3 tracking-tight">Puni NDA Proces</h3>
              <p className="text-slate-300 font-sans font-light leading-relaxed">
                Besprijekoran digitalni potpis NDA uz punu pravnu zaštitu EU propisa.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Cinematic Editorial CTA */}
      <section className="relative py-48 md:py-64 overflow-hidden z-10 w-full flex items-center justify-center">
        {/* Luxury Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950 z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-gold/10 via-trust/10 to-transparent blur-[120px] opacity-60 z-0" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center relative"
          >
            <h2 className="font-heading text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[1.1]">
              Sljedeći korak je <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">na vama.</span>
            </h2>
            <p className="text-slate-400 text-xl md:text-3xl font-light mb-16 max-w-2xl mx-auto leading-relaxed">
              Pridružite se ekskluzivnom krugu tvrtki i investitora koji mijenjaju landscape regije.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-20 px-16 text-2xl rounded-full bg-white text-slate-950 hover:bg-slate-200 font-bold border-none shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-500">
                  Započnite proces
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ultra Minimalist Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950 relative z-10 w-full text-center">
        <p className="text-slate-600 font-sans text-sm tracking-widest uppercase">
          &copy; {new Date().getFullYear()} DealFlow Platform. Sva prava pridržana.
        </p>
      </footer>
    </div>
  );
}
