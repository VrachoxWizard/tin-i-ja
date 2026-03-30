"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
          Nešto je pošlo po krivu
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {error.message || "Došlo je do neočekivane pogreške. Pokušajte ponovo."}
        </p>
        <Button
          onClick={reset}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 h-11 font-heading uppercase tracking-widest text-sm"
        >
          Pokušaj ponovo
        </Button>
      </div>
    </div>
  );
}
