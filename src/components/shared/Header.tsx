"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "/listings", label: "Kupujem" },
  { href: "/sell", label: "Prodajem" },
  { href: "/succession", label: "Nasljeđivanje" },
];

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
      staggerChildren: 0.06,
      when: "beforeChildren" as const,
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-slate-950/60 backdrop-blur-2xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)] py-2.5 mx-auto rounded-2xl mt-3 left-4 right-4 w-[calc(100%-2rem)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-2xl font-bold tracking-tight text-white flex items-center gap-2 group"
        >
          <div className="size-8 rounded-lg bg-linear-to-br from-trust to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-all duration-300 border border-white/10">
            <span className="text-white text-sm font-bold">D</span>
          </div>
          DealFlow
        </Link>

        {/* Desktop Nav — magnetic hover with sliding indicator */}
        <div className="hidden md:flex flex-1 justify-center">
          <nav
            className="flex items-center gap-1 text-sm font-medium font-sans px-2 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-slate-300 hover:text-white transition-colors px-5 py-2 rounded-full"
                onMouseEnter={() => setHoveredLink(link.href)}
              >
                {hoveredLink === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full bg-white/[0.08]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop CTA — idle glow pulse */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="font-sans text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Prijava
          </Link>
          <Link href="/valuate">
            <Button className="btn-shimmer bg-gold text-slate-950 hover:bg-gold/90 rounded-full font-heading px-6 shadow-[0_0_15px_rgba(201,165,80,0.3)] hover:shadow-[0_0_25px_rgba(201,165,80,0.5)] transition-all border-none group animate-[glow-pulse_3s_ease-in-out_infinite]">
              Procijeni vrijednost
              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Zatvori izbornik" : "Otvori izbornik"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu — staggered entrance, richer backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 w-full bg-slate-950/98 backdrop-blur-2xl border-b border-white/10 shadow-glass md:hidden"
          >
            <div className="absolute inset-0 bg-linear-to-b from-trust/5 to-transparent pointer-events-none" />
            <div className="flex flex-col px-4 py-6 space-y-1 font-sans text-base relative z-10">
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={mobileLinkVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-300 hover:text-white transition-colors py-3 border-b border-white/5 block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={mobileLinkVariants}>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white font-semibold py-3 block"
                >
                  Prijava
                </Link>
              </motion.div>
              <motion.div variants={mobileLinkVariants}>
                <Link
                  href="/valuate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="pt-2 block"
                >
                  <Button className="w-full btn-shimmer bg-gold text-slate-950 hover:bg-gold/90 rounded-full font-heading shadow-[0_0_15px_rgba(201,165,80,0.3)] border-none">
                    Procijeni vrijednost
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
