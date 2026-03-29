import { Metadata } from "next";
import { TeaserCard } from "@/components/features/TeaserCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pregled Tvrtki (M&A Prilike) | DealFlow",
  description: "Pregledajte verificirane B2B akvizicijske prilike u Hrvatskoj.",
};

export default async function ListingsPage() {
  const supabase = await createClient();
  const { data: listings } = await supabase.rpc("get_active_teasers");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Search Header - Premium Dark Section */}
      <div className="relative bg-background border-b border-white/10 pt-24 pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-60" />

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 font-heading tracking-tight">
              Akvizicijske Prilike
            </h1>
            <p className="text-lg text-muted-foreground font-sans max-w-2xl leading-relaxed">
              Pregledajte strogo verificirane i anonimizirane profile tvrtki
              (slijepi teaseri) koje su trenutno otvorene za akviziciju ili
              investiciju na hrvatskom tržištu.
            </p>
          </div>

          {/* Floating Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 p-2 bg-card rounded-none border border-white/10 shadow-none">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Pretraži po industriji, regiji ili ključnoj riječi..."
                className="pl-12 py-7 text-lg bg-transparent border-none text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-full"
              />
            </div>
            <Button
              size="lg"
              className="py-7 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-heading rounded-none min-w-[140px] text-lg uppercase tracking-wider"
            >
              Traži
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full py-12 relative z-10 -mt-6">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters - Glassmorphic */}
          <aside className="w-full md:w-72 shrink-0">
            <div className="bg-card p-6 rounded-none border border-white/10 sticky top-28 space-y-8">
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2 font-heading">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />{" "}
                  Filteri
                </h3>
                <button className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary font-bold transition-colors duration-200">
                  Poništi sve
                </button>
              </div>

              <div className="space-y-6">
                {/* Industrija */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">
                    Industrija
                  </Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full bg-white/5 border-white/10 h-12 rounded-none font-sans text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-white/10 bg-card">
                      <SelectItem value="all">Sve Industrije</SelectItem>
                      <SelectItem value="it">IT i Softver</SelectItem>
                      <SelectItem value="manufacturing">Proizvodnja</SelectItem>
                      <SelectItem value="tourism">Turizam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Regija */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">
                    Regija
                  </Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full bg-white/5 border-white/10 h-12 rounded-none font-sans text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-white/10 bg-card">
                      <SelectItem value="all">Cijela Hrvatska</SelectItem>
                      <SelectItem value="zagreb">Grad Zagreb</SelectItem>
                      <SelectItem value="dalmacija">Dalmacija</SelectItem>
                      <SelectItem value="istra">Istra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* EBITDA */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">
                    EBITDA Raspon
                  </Label>
                  <Select defaultValue="any">
                    <SelectTrigger className="w-full bg-white/5 border-white/10 h-12 rounded-none font-sans text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-white/10 bg-card">
                      <SelectItem value="any">Bilo koji iznos</SelectItem>
                      <SelectItem value="0-100">Do 100k EUR</SelectItem>
                      <SelectItem value="100-500">100k - 500k EUR</SelectItem>
                      <SelectItem value="500+">Preko 500k EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all h-12 rounded-none font-heading uppercase tracking-widest">
                  Primijeni Filtere
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-muted-foreground font-sans text-sm">
                Prikazano{" "}
                <span className="font-bold text-foreground">
                  {listings?.length || 0}
                </span>{" "}
                rezultata
              </p>
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                  Poredaj po:
                </span>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-48 bg-white/5 border-white/10 h-10 rounded-none font-sans text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-white/10 bg-card">
                    <SelectItem value="newest">Najnovije dodano</SelectItem>
                    <SelectItem value="ebitda-desc">Najviša EBITDA</SelectItem>
                    <SelectItem value="revenue-desc">Najviši Prihod</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {listings?.map(
                (teaser: {
                  listing_id: string;
                  industry_nkd: string;
                  region: string;
                  revenue_eur: number;
                  ebitda_eur: number;
                  asking_price_eur: number;
                  blind_teaser: string;
                }) => (
                  <TeaserCard
                    key={teaser.listing_id}
                    id={teaser.listing_id.split("-")[0]}
                    industry={teaser.industry_nkd}
                    region={teaser.region}
                    revenue={teaser.revenue_eur}
                    ebitda={teaser.ebitda_eur}
                    askingPrice={teaser.asking_price_eur}
                    blindTeaserHtml={teaser.blind_teaser}
                  />
                ),
              )}
              {(!listings || listings.length === 0) && (
                <div className="col-span-1 lg:col-span-2 text-center py-32 bg-card rounded-none border border-white/10 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-none flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground font-heading mb-2">
                    Nema rezultata
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto font-sans">
                    Trenutno nemamo aktivnih M&A prilika koje odgovaraju vašim
                    kriterijima. Pokušajte izmijeniti filtere.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-8 border-white/20 text-foreground hover:bg-white/5 font-heading uppercase tracking-widest px-8 h-12 rounded-none"
                  >
                    Poništi filtere
                  </Button>
                </div>
              )}
            </div>

            {listings && listings.length > 0 && (
              <div className="mt-16 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border border-white/20 hover:border-primary hover:bg-primary/5 text-foreground font-heading uppercase tracking-widest px-10 h-14 rounded-none transition-all"
                >
                  Učitaj još prilika
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
