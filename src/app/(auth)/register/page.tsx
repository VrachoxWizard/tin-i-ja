"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signup } from "./actions";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useState, Suspense } from "react";

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
          Stvori račun
          <ArrowRight className="ml-2 w-4 h-4" />
        </>
      )}
    </Button>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const getStrength = (pwd: string): number => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const colors = [
    "bg-destructive",
    "bg-destructive",
    "bg-amber-500",
    "bg-amber-400",
    "bg-emerald-500",
    "bg-emerald-400",
  ];
  const labels = ["", "Slaba", "Slaba", "Srednja", "Dobra", "Odlična"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? colors[strength] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{labels[strength]}</p>
    </div>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const errorMessage = getAuthErrorMessage(errorCode);
  const [password, setPassword] = useState("");

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
          Stvorite račun
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground"
        >
          Pridružite se ekskluzivnoj mreži za M&A u Hrvatskoj.
        </motion.p>
      </div>

      {/* Error message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          {errorMessage}
        </motion.div>
      )}

      {/* Form */}
      <form action={signup} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-2"
        >
          <Label
            htmlFor="full_name"
            className="text-foreground text-sm font-medium"
          >
            Ime i prezime
          </Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Ivan Horvat"
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
          transition={{ duration: 0.5, delay: 0.35 }}
          className="space-y-2"
        >
          <Label
            htmlFor="password"
            className="text-foreground text-sm font-medium"
          >
            Lozinka
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl bg-muted/50 border-border/60 px-4 text-base placeholder:text-muted-foreground/60 focus-visible:bg-background transition-colors"
          />
          <PasswordStrength password={password} />
        </motion.div>

        {/* Role selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="space-y-2"
        >
          <Label className="text-foreground text-sm font-medium">
            Registriram se kao
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "buyer", label: "Kupac / Investitor", desc: "Tražim tvrtku za akviziciju" },
              { value: "seller", label: "Prodavatelj", desc: "Želim prodati tvrtku" },
            ].map((option) => (
              <label
                key={option.value}
                className="relative flex flex-col items-center gap-1.5 p-4 rounded-xl border border-border/60 bg-muted/30 cursor-pointer hover:border-gold/40 hover:bg-muted/50 transition-all has-[:checked]:border-gold has-[:checked]:bg-gold/5 has-[:checked]:shadow-[0_0_12px_rgba(212,175,55,0.1)]"
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  defaultChecked={option.value === "buyer"}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-foreground">{option.label}</span>
                <span className="text-[0.65rem] text-muted-foreground text-center leading-tight">{option.desc}</span>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col gap-2 pt-1 text-xs text-muted-foreground"
        >
          {[
            "SSL šifrirana platforma",
            "Potpuna diskrecija podataka",
            "GDPR sukladnost",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>{item}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="pt-2"
        >
          <SubmitButton />
        </motion.div>
      </form>

      {/* Footer link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        Već imate račun?{" "}
        <Link
          href="/login"
          className="text-gold font-semibold hover:text-gold/80 transition-colors"
        >
          Prijavite se
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
