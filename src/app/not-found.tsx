import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-heading font-bold text-primary mb-4">404</p>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
          Stranica nije pronađena
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Stranica koju tražite ne postoji ili je premještena.
        </p>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 h-11 font-heading uppercase tracking-widest text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Povratak na početnu
          </Button>
        </Link>
      </div>
    </div>
  );
}
