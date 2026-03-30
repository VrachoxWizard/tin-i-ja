"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { login } from "./actions";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Suspense } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 rounded-xl bg-gold hover:bg-gold/90 text-navy font-heading font-bold text-base btn-shimmer transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          Prijavi se
          <ArrowRight className="ml-2 w-4 h-4" />
        </>
      )}
    </Button>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-heading font-bold text-foreground tracking-tight mb-2"
        >
          Dobro došli natrag
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground"
        >
          Unesite svoje podatke za pristup DealFlow platformi.
        </motion.p>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          {error}
        </motion.div>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
        >
          {message}
        </motion.div>
      )}

      {/* Form */}
      <form action={login} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-2"
        >
          <Label
            htmlFor="email"
            className="text-foreground text-sm font-medium"
          >
            Email adresa
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ime@tvrtka.hr"
            required
            className="h-12 rounded-xl bg-muted/50 border-border/60 px-4 text-base placeholder:text-muted-foreground/60 focus-visible:bg-background transition-colors"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-foreground text-sm font-medium"
            >
              Lozinka
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-gold transition-colors"
            >
              Zaboravljena lozinka?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="h-12 rounded-xl bg-muted/50 border-border/60 px-4 text-base placeholder:text-muted-foreground/60 focus-visible:bg-background transition-colors"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="pt-2"
        >
          <SubmitButton />
        </motion.div>
      </form>

      {/* Footer link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        Nemate račun?{" "}
        <Link
          href="/register"
          className="text-gold font-semibold hover:text-gold/80 transition-colors"
        >
          Registrirajte se
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
