"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-7 h-7 text-destructive" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground mb-3">
          Greška pri učitavanju
        </h2>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          {error.message || "Došlo je do pogreške. Pokušajte ponovo."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6 h-10 font-heading uppercase tracking-widest text-xs"
          >
            Pokušaj ponovo
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="rounded-none px-6 h-10 font-heading uppercase tracking-widest text-xs"
            >
              Početna
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
