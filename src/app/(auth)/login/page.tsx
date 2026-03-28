import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { login } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-heading font-bold text-foreground">
            Prijava
          </CardTitle>
          <CardDescription className="text-muted-foreground font-sans">
            Unesite svoje podatke za pristup DealFlow platformi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4 font-sans">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email adresa</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ime@tvrtka.hr"
                required
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Lozinka</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-background/50 border-border/50"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heading mt-6">
              Prijavi se
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center font-sans">
          <div className="text-sm text-muted-foreground w-full">
            Nemate račun?{" "}
            <Link href="/register" className="text-accent font-semibold hover:underline">
              Registrirajte se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
