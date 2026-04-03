"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/(auth)/logout/actions";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/sell", label: "Prodajem" },
  { href: "/buy", label: "Kupujem" },
  { href: "/valuate", label: "Procijeni vrijednost" },
  { href: "/succession", label: "Nasljeđivanje" },
  { href: "/contact", label: "Kontakt" },
];

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
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser({ id: authUser.id, role: authUser.user_metadata?.role });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, role: session.user.user_metadata?.role });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const dashboardPath =
    user?.role === "seller" ? "/dashboard/seller" : "/dashboard/buyer";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-border bg-background/92 backdrop-blur-xl"
          : "border-transparent bg-background/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-primary/20 bg-primary/8 text-primary">
            <span className="font-heading text-sm font-semibold tracking-[0.2em]">
              DF
            </span>
          </div>
          <div>
            <p className="font-heading text-lg text-foreground tracking-tight">
              DealFlow
            </p>
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
              Hrvatska M&amp;A platforma
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link href={dashboardPath}>
                <Button variant="outline" className="rounded-none">
                  Dashboard
                </Button>
              </Link>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="rounded-none text-muted-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Odjava
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="rounded-none">
                  Prijava
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90">
                  Započni
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label={mobileMenuOpen ? "Zatvori navigaciju" : "Otvori navigaciju"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href={dashboardPath} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-none">
                      Dashboard
                    </Button>
                  </Link>
                  <form action={logout}>
                    <Button
                      type="submit"
                      variant="ghost"
                      className="w-full rounded-none"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Odjava
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-none">
                      Prijava
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90">
                      Započni
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
