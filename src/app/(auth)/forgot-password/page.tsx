"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { resetPassword } from "./actions";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
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
          <Mail className="w-4 h-4 mr-2" />
          Pošalji link za resetiranje
        </>
      )}
    </Button>
  );
}

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
          Email poslan!
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Provjerite svoju email adresu za link za resetiranje lozinke.
          Link vrijedi 24 sata.
        </p>
        <Link href="/login">
          <Button
            variant="outline"
            className="rounded-xl px-8 h-11 font-heading"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Povratak na prijavu
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-heading font-bold text-foreground tracking-tight mb-2"
        >
          Resetiraj lozinku
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground"
        >
          Unesite email adresu i poslat ćemo vam link za resetiranje.
        </motion.p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          {error}
        </motion.div>
      )}

      <form action={resetPassword} className="space-y-5">
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
          className="pt-2"
        >
          <SubmitButton />
        </motion.div>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        <Link
          href="/login"
          className="text-gold font-semibold hover:text-gold/80 transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Povratak na prijavu
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
