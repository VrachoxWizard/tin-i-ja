"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Menu, X, LogOut, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/(auth)/logout/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { getDashboardPathForRole } from "@/lib/contracts";

const navLinks = [
  { href: "/sell", label: "Prodajem" },
  { href: "/buy", label: "Kupujem" },
  { href: "/valuate", label: "Procjena" },
  { href: "/succession", label: "Nasljeđe" },
  { href: "/contact", label: "Kontakt" },
];

const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as const;
const CINEMATIC_EASE = [0.76, 0, 0.24, 1] as const;

const iconVariants = {
  initial: { opacity: 0, rotate: -45, scale: 0.6 },
  animate: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.2, ease: EASE_OUT } },
  exit: { opacity: 0, rotate: 45, scale: 0.6, transition: { duration: 0.14 } },
};

// Full-screen masterpiece mobile menu variants
const fullscreenMenuVariants = {
  hidden: { opacity: 0, clipPath: "circle(0% at 100% 0%)" },
  visible: {
    opacity: 1,
    clipPath: "circle(150% at 100% 0%)",
    transition: {
      duration: 1.2,
      ease: CINEMATIC_EASE,
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    clipPath: "circle(0% at 100% 0%)",
    transition: {
      duration: 0.8,
      ease: CINEMATIC_EASE,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const massiveLinkVariants = {
  hidden: { y: "150%", rotate: 8, opacity: 0 },
  visible: {
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { duration: 1, ease: CINEMATIC_EASE }
  },
  exit: {
    y: "-50%",
    opacity: 0,
    transition: { duration: 0.4, ease: CINEMATIC_EASE }
  }
};

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; role?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const supabase = createClient();

    async function hydrateUser(authUser: { id: string }) {
      const { data: profile } = await supabase
        .from("users")
        .select("role, suspended_at")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profile?.suspended_at) {
        setUser(null);
        return;
      }

      setUser({ id: authUser.id, role: profile?.role });
    }

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        void hydrateUser(authUser);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void hydrateUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  const dashboardPath = getDashboardPathForRole(user?.role);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 border-b ${isScrolled
          ? "border-primary/20 bg-card-elevated/40 backdrop-blur-xl shadow-glass-elevated"
          : "border-transparent bg-transparent"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group relative z-[60]" onClick={closeMenu}>
            <Logo />
            <div>
              <p className="font-heading text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">DealFlow</p>
              <p className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                {'Premium M&A'}
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10 text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground/90">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-2 hover:text-foreground transition-colors after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth actions */}
          <div className="hidden lg:flex items-center gap-4 relative z-[60]">
            <ThemeToggle />
            {user ? (
              <>
                <Link href={dashboardPath}>
                  <Button variant="outline" className="h-10 px-6 rounded-none border-primary/40 bg-card-elevated/40 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.05)] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:border-primary/60 transition-all text-sm tracking-widest uppercase font-semibold">
                    Trezor
                  </Button>
                </Link>
                <form action={logout}>
                  <Button type="submit" variant="ghost" className="h-10 px-4 rounded-none text-muted-foreground text-sm tracking-widest uppercase hover:text-foreground hover:bg-card-elevated transition-colors">
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    Odjava
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="h-10 px-5 rounded-none text-sm font-semibold tracking-widest uppercase hover:text-foreground">Autorizacija</Button>
                </Link>
                <Link href="/register">
                  <Button className="h-10 px-6 rounded-none border border-primary/50 btn-shimmer bg-card-elevated/80 backdrop-blur-md hover:bg-primary/20 text-foreground text-sm font-semibold uppercase tracking-[0.18em] shadow-glow-gold transition-all duration-500">
                    Zahtjev za Pristup
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger button */}
          <button
            className="lg:hidden relative w-12 h-12 flex items-center justify-center text-foreground border border-primary/30 bg-card-elevated/80 backdrop-blur-xl z-[60] shadow-glow-gold"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Zatvori navigaciju" : "Otvori navigaciju"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span key="x" variants={iconVariants} initial="initial" animate="animate" exit="exit">
                  <X className="w-6 h-6 text-primary" />
                </motion.span>
              ) : (
                <motion.span key="menu" variants={iconVariants} initial="initial" animate="animate" exit="exit">
                  <Menu className="w-6 h-6 text-primary" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ── CINEMATIC FULLSCREEN MOBILE MENU ───────────────────────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav"
              key="mobile-menu"
              variants={fullscreenMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="navigation"
              aria-label="Mobilna navigacija"
              className="lg:hidden fixed inset-0 z-50 bg-[#02050A] flex flex-col justify-center overflow-hidden"
            >
              {/* Massive background ambient element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_60%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-10 left-[-10%] text-[30vw] font-heading font-black text-foreground/5 whitespace-nowrap pointer-events-none z-0 transform -rotate-12 select-none">
                DEALFLOW
              </div>

              <div className="relative z-10 w-full px-6 flex flex-col items-start gap-4">
                {navLinks.map((link) => (
                  <div key={link.href} className="overflow-hidden py-1">
                    <motion.div variants={massiveLinkVariants} className="origin-left">
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="group flex items-center gap-6 font-heading font-black text-[clamp(2.5rem,10vw,4.5rem)] text-foreground hover:text-primary transition-colors duration-500 uppercase tracking-tighter leading-none"
                      >
                        {link.label}
                        <ArrowRight className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" />
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </div>

              <motion.div
                variants={footerVariants}
                className="absolute bottom-12 left-6 right-6 flex flex-col gap-6"
              >
                <div className="h-px w-full bg-gradient-to-r from-primary/50 to-transparent" />
                <div className="flex flex-col gap-4">
                  {user ? (
                    <>
                      <Link href={dashboardPath} onClick={closeMenu}>
                        <Button className="w-full rounded-none h-14 border border-primary/50 bg-primary/10 text-foreground text-xs tracking-[0.25em] uppercase shadow-glow-gold hover:bg-primary/30 transition-colors">
                          Pristupi Trezoru
                        </Button>
                      </Link>
                      <form action={logout}>
                        <Button type="submit" variant="ghost" className="w-full rounded-none h-12 text-muted-foreground text-xs tracking-[0.2em] uppercase">
                          <LogOut className="w-4 h-4 mr-2" />
                          Odjava
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link href="/register" onClick={closeMenu}>
                        <Button className="w-full rounded-none h-14 border border-primary/50 btn-shimmer bg-primary/15 text-foreground text-xs tracking-[0.25em] uppercase shadow-glow-gold hover:bg-primary/30 transition-colors">
                          Zahtjev za Pristup
                        </Button>
                      </Link>
                      <Link href="/login" onClick={closeMenu}>
                        <Button variant="outline" className="w-full rounded-none h-12 border-primary/30 bg-transparent text-xs tracking-[0.2em] uppercase hover:bg-card-elevated">
                          Autorizacija
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
