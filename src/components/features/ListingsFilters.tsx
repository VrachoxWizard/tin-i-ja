"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
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

export function ListingsSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const q = formData.get("q") as string;
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }
      router.push(`/listings?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-4 p-2 bg-card rounded-none border border-white/10 shadow-none"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={searchParams.get("q") || ""}
          placeholder="Pretraži po industriji, regiji ili ključnoj riječi..."
          className="pl-12 py-7 text-lg bg-transparent border-none text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-full"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="py-7 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-heading rounded-none min-w-[140px] text-lg uppercase tracking-wider"
      >
        Traži
      </Button>
    </form>
  );
}

export function ListingsSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all" && value !== "any") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/listings?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleReset = useCallback(() => {
    router.push("/listings");
  }, [router]);

  return (
    <div className="bg-card p-6 rounded-none border border-white/10 sticky top-28 space-y-8">
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2 font-heading">
          <SlidersHorizontal className="w-5 h-5 text-primary" /> Filteri
        </h3>
        <button
          onClick={handleReset}
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary font-bold transition-colors duration-200"
        >
          Poništi sve
        </button>
      </div>

      <div className="space-y-6">
        {/* Industrija */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">
            Industrija
          </Label>
          <Select
            defaultValue={searchParams.get("industry") ?? "all"}
            onValueChange={(v: string | null) => handleFilter("industry", v ?? "all")}
          >
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
          <Select
            defaultValue={searchParams.get("region") ?? "all"}
            onValueChange={(v: string | null) => handleFilter("region", v ?? "all")}
          >
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
          <Select
            defaultValue={searchParams.get("ebitda") ?? "any"}
            onValueChange={(v: string | null) => handleFilter("ebitda", v ?? "any")}
          >
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
    </div>
  );
}

export function ListingsSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "newest") {
        params.set("sort", value);
      } else {
        params.delete("sort");
      }
      router.push(`/listings?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="hidden sm:flex items-center gap-3">
      <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
        Poredaj po:
      </span>
      <Select
        defaultValue={searchParams.get("sort") ?? "newest"}
        onValueChange={(v: string | null) => handleSort(v ?? "newest")}
      >
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
  );
}
