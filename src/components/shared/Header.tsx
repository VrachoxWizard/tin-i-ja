"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/(auth)/logout/actions";

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
  const [user, setUser] = useState<{ id: string; role?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser({ id: authUser.id, role: authUser.user_metadata?.role });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, role: session.user.user_metadata?.role });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const dashboardPath = user?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer';

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.4)] py-2.5 mx-4 sm:mx-auto rounded-full mt-4 left-0 right-0 max-w-4xl"
          : "bg-transparent py-6"
      }`}
    >
      <div className={`mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 ${isScrolled ? "max-w-4xl" : "max-w-7xl"}`}>
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-4 group"
        >
          {/* Minimalist Geometric Mark */}
          <div className="relative size-8 flex items-center justify-center overflow-hidden border border-primary/50 group-hover:border-primary transition-colors duration-500">
            <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="font-heading text-primary text-[0.65rem] tracking-widest pl-[1px]">DF</span>
          </div>
          {/* Typographic Name */}
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-[0.1em] text-foreground leading-none">
              DEALFLOW
            </span>
            <span className="text-[0.45rem] tracking-[0.3em] text-muted-foreground uppercase leading-none mt-1.5 opacity-80">
              Advisory
            </span>
          </div>
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

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link
                href={dashboardPath}
                className="font-sans text-[0.75rem] font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="font-sans text-[0.75rem] font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="size-3.5" />
                  Odjava
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="font-sans text-[0.75rem] font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Prijava
            </Link>
          )}
          <Link href="/valuate">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6 text-[0.7rem] font-bold tracking-[0.2em] uppercase transition-all duration-300 h-10">
              Procjena
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
            role="dialog"
            aria-modal="true"
            aria-label="Navigacija"
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
                {user ? (
                  <div className="flex flex-col gap-1">
                    <Link
                      href={dashboardPath}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-white font-semibold py-3 border-b border-white/5 block"
                    >
                      Dashboard
                    </Link>
                    <form action={logout}>
                      <button
                        type="submit"
                        className="text-slate-300 hover:text-white font-semibold py-3 flex items-center gap-2 w-full"
                      >
                        <LogOut className="size-4" />
                        Odjava
                      </button>
                    </form>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white font-semibold py-3 block"
                  >
                    Prijava
                  </Link>
                )}
              </motion.div>
              <motion.div variants={mobileLinkVariants}>
                <Link
                  href="/valuate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="pt-4 block"
                >
                  <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[0.75rem] font-bold tracking-[0.2em] uppercase transition-all duration-300">
                    Besplatna Procjena
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
