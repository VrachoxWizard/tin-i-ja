"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Brand / Trust */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative overflow-hidden bg-navy flex-col justify-between p-12">
        {/* Ambient glow effects */}
        <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-trust/20 rounded-full blur-[140px] gpu-layer" />
        <div className="absolute bottom-[-10%] right-[-20%] w-100 h-100 bg-gold/15 rounded-full blur-[120px] gpu-layer" />
        <div className="absolute top-[40%] left-[50%] w-75 h-75 bg-indigo-500/10 rounded-full blur-[100px] gpu-layer" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-trust to-blue-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-heading font-bold text-lg">
                D
              </span>
            </div>
            <span className="text-white font-heading text-xl font-bold tracking-tight">
              DealFlow
            </span>
          </Link>
        </motion.div>

        {/* Brand messaging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-md"
        >
          <h2 className="text-3xl xl:text-4xl font-heading font-bold text-white mb-6 leading-tight tracking-tight">
            Platforma koja spaja{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gold via-yellow-200 to-gold">
              ambiciju i naslijeđe.
            </span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Ekskluzivna mreža za vlasnike malih i srednjih tvrtki te
            kvalificirane investitore na hrvatskom tržištu.
          </p>

          {/* Trust principles — 3 credible statements instead of fake stats */}
          <div className="flex flex-col gap-4">
            {[
              {
                icon: "🔒",
                title: "Potpuna diskrecija",
                body: "Identitet vaše tvrtke ostaje skriven sve do NDA odobrenja.",
              },
              {
                icon: "🤝",
                title: "Verificirani sudionici",
                body: "Svaki kupac prolazi provjeru profila prije pristupa deal roomu.",
              },
              {
                icon: "⚖️",
                title: "Strukturiran proces",
                body: "AI procjena, blind teaser, NDA workflow i siguran deal room.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white/90 leading-snug">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative z-10 flex items-center gap-3 text-slate-600 text-sm"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          Sigurno i šifrirano — SSL zaštita podataka
        </motion.div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background relative overflow-hidden">
        {/* Subtle ambient glow for the form side */}
        <div className="absolute top-[20%] right-[-10%] w-75 h-75 bg-gold/5 rounded-full blur-[100px] gpu-layer" />
        <div className="absolute bottom-[10%] left-[-5%] w-50 h-50 bg-trust/5 rounded-full blur-[80px] gpu-layer" />

        {/* Mobile logo (hidden on desktop) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-trust to-blue-700 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">
                D
              </span>
            </div>
            <span className="text-foreground font-heading text-lg font-bold tracking-tight">
              DealFlow
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md relative z-10">{children}</div>
      </div>
    </div>
  );
}
