"use client";

import React, { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, Target } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  saveBuyerProfileAction,
  type ActionResult,
} from "@/app/actions/dealflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUYER_INDUSTRIES, REGIONS } from "@/data/constants";

// Form Validation Schema matching backend exact specifications.
// Wide open inputs for target bounds per user specs.
const buyerSchema = z.object({
  buyer_type: z.string().min(1, "Navedite tip investitora"),
  target_ev_min: z.number().min(0, "Mora biti pozitivno"),
  target_ev_max: z.number().min(0, "Mora biti pozitivno"),
  target_revenue_min: z.number().min(0, "Mora biti pozitivno"),
  target_revenue_max: z.number().min(0, "Mora biti pozitivno"),
  target_industries: z.array(z.string()).min(1, "Odaberite barem jedan sektor"),
  target_regions: z.array(z.string()).min(1, "Odaberite barem jednu regiju"),
  investment_thesis: z.string().min(12, "Unesite detaljnije (barem 12 znakova)"),
}).superRefine((data, ctx) => {
  if (data.target_ev_max < data.target_ev_min) {
    ctx.addIssue({
      code: "custom",
      path: ["target_ev_max"],
      message: "Max EV mora biti jednak ili veći od Min EV",
    });
  }
  if (data.target_revenue_max < data.target_revenue_min) {
    ctx.addIssue({
      code: "custom",
      path: ["target_revenue_max"],
      message: "Max prihod mora biti jednak ili veći od Min prihoda",
    });
  }
});

type BuyerFormValues = z.infer<typeof buyerSchema>;

const ToggleChips = React.memo(function ToggleChips({
  options,
  selected,
  onChange,
}: {
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = React.useCallback(
    (option: string) => {
      onChange(
        selected.includes(option)
          ? selected.filter((s) => s !== option)
          : [...selected, option],
      );
    },
    [selected, onChange]
  );

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Odabir opcija">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(opt);
              }
            }}
            aria-pressed={active}
            className={`px-3 py-1.5 text-xs font-medium border transition-all duration-300 cursor-pointer rounded-none ${
              active
                ? "bg-primary text-primary-foreground border-primary shadow-glow-gold"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/60 hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
});

export function BuyerOnboardingForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      buyer_type: "",
      target_industries: [],
      target_regions: [],
      investment_thesis: "",
    },
    mode: "onTouched",
  });

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof BuyerFormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ["buyer_type", "target_ev_min", "target_ev_max"];
    } else if (step === 2) {
      fieldsToValidate = ["target_revenue_min", "target_revenue_max", "target_industries", "target_regions"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setStep((curr) => Math.min(curr + 1, 3));
    } else {
      toast.error("Ispunite obavezna polja ispravno.");
    }
  };

  const handleBackStep = () => {
    setStep((curr) => Math.max(curr - 1, 1));
  };

  const onSubmit = (data: BuyerFormValues) => {
    const payload = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((entry) => payload.append(key, entry));
      } else {
        payload.set(key, String(value));
      }
    });

    startTransition(async () => {
      const nextResult = await saveBuyerProfileAction(payload);
      setResult(nextResult);

      if (nextResult.error) {
        toast.error(nextResult.error);
        return;
      }

      toast.success(
        nextResult.message || "Investicijski profil je uspješno spremljen.",
      );
    });
  };

  if (result?.success) {
    return (
      <Card className="border border-border bg-card rounded-none max-w-3xl mx-auto text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(21,101,192,0.12),transparent_60%)] pointer-events-none" />
        <CardContent className="flex flex-col items-center justify-center space-y-8 relative z-10">
          <div className="p-5 border border-primary/30 text-primary bg-primary/5">
            <CheckCircle className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl font-heading text-foreground tracking-tight leading-tight">
              Profil investitora je aktivan.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vaši kriteriji su spremljeni i DealFlow sada automatski
              izračunava podudaranja s novim aktivnim prilika.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard/buyer">
              <Button className="h-12 px-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.18em] text-xs">
                Otvori dashboard
              </Button>
            </Link>
            <Link href="/listings">
              <Button variant="outline" className="h-12 px-8 rounded-none">
                Pregledaj prilike
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card/70 backdrop-blur-sm rounded-none relative overflow-hidden">
      <div className="absolute top-0 left-0 h-1 bg-muted/60 w-full">
        <motion.div
          className="h-full bg-primary shadow-[0_0_15px_rgba(201,168,76,0.5)]"
          initial={{ width: "33.33%" }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <CardHeader className="pt-12 px-8 md:px-10 border-b border-border pb-8">
        <div className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary mb-4">
          <Target className="w-3.5 h-3.5" />
          Kvalificirani investitorski profil
        </div>
        <CardTitle className="text-2xl md:text-3xl font-heading text-foreground tracking-tight">
          Korak {step} / 3
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-2 leading-relaxed">
          Definirajte raspon transakcije, ciljane sektore i investicijsku tezu
          kako bi algoritam filtrirao relevantne prilike.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 md:px-10 pb-6 relative z-10 pt-8">
        <form id="buyer-onboarding-form" onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="buyer-step-1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label>Tip investitora</Label>
                  <Controller
                    name="buyer_type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={`h-14 bg-transparent border-0 border-b-2 border-border/40 px-0 rounded-none focus:ring-0 focus:border-primary transition-all duration-300 text-lg font-heading tracking-wide ${errors.buyer_type ? "border-destructive" : ""}`}>
                          <SelectValue placeholder="Odaberite profil investitora" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          <SelectItem value="individual">Fizička osoba / poduzetnik</SelectItem>
                          <SelectItem value="strategic">Strateški investitor</SelectItem>
                          <SelectItem value="financial">Financijski investitor</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.buyer_type && <p className="text-xs text-destructive">{errors.buyer_type.message}</p>}
                </div>

                <div className="flex flex-col gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="target_ev_min">Minimalni EV (EUR)</Label>
                    <Input
                      {...register("target_ev_min", { valueAsNumber: true })}
                      type="number"
                      placeholder="Npr. 0 za vrlo rane"
                      className={`h-14 bg-transparent border-0 border-b-2 border-border/40 px-0 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all duration-300 text-lg font-heading tracking-wide placeholder:text-muted-foreground/30 ${errors.target_ev_min ? "border-destructive" : ""}`}
                    />
                    {errors.target_ev_min && <p className="text-xs text-destructive">{errors.target_ev_min.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="target_ev_max">Maksimalni EV (EUR)</Label>
                    <Input
                      {...register("target_ev_max", { valueAsNumber: true })}
                      type="number"
                      placeholder="Bez ograničenja"
                      className={`h-14 bg-transparent border-0 border-b-2 border-border/40 px-0 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all duration-300 text-lg font-heading tracking-wide placeholder:text-muted-foreground/30 ${errors.target_ev_max ? "border-destructive" : ""}`}
                    />
                    {errors.target_ev_max && <p className="text-xs text-destructive">{errors.target_ev_max.message}</p>}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  EV raspon koristimo kao najvažniji signal za algoritamsko uparivanje. Ostavite 0 ukoliko su vam kriteriji otvoreni.
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="buyer-step-2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="target_revenue_min">Minimalni prihod (EUR)</Label>
                    <Input
                      {...register("target_revenue_min", { valueAsNumber: true })}
                      type="number"
                      placeholder="0"
                      className={`h-14 bg-transparent border-0 border-b-2 border-border/40 px-0 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all duration-300 text-lg font-heading tracking-wide placeholder:text-muted-foreground/30 ${errors.target_revenue_min ? "border-destructive" : ""}`}
                    />
                    {errors.target_revenue_min && <p className="text-xs text-destructive">{errors.target_revenue_min.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="target_revenue_max">Maksimalni prihod (EUR)</Label>
                    <Input
                      {...register("target_revenue_max", { valueAsNumber: true })}
                      type="number"
                      placeholder="10000000"
                      className={`h-14 bg-transparent border-0 border-b-2 border-border/40 px-0 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all duration-300 text-lg font-heading tracking-wide placeholder:text-muted-foreground/30 ${errors.target_revenue_max ? "border-destructive" : ""}`}
                    />
                    {errors.target_revenue_max && <p className="text-xs text-destructive">{errors.target_revenue_max.message}</p>}
                  </div>
                </div>

                <div className="space-y-5 border border-border p-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Sektori interesa</Label>
                    </div>
                    <Controller
                      name="target_industries"
                      control={control}
                      render={({ field }) => (
                        <ToggleChips
                          options={BUYER_INDUSTRIES}
                          selected={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.target_industries && <p className="text-xs text-destructive">{errors.target_industries.message}</p>}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <Label>Regije interesa</Label>
                    </div>
                    <Controller
                      name="target_regions"
                      control={control}
                      render={({ field }) => (
                        <ToggleChips
                          options={REGIONS}
                          selected={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.target_regions && <p className="text-xs text-destructive">{errors.target_regions.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="buyer-step-3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label htmlFor="investment_thesis">Investicijska teza i motivacija</Label>
                  <Textarea
                    {...register("investment_thesis")}
                    rows={5}
                    className={`resize-none h-auto bg-transparent border-0 border-b-2 border-border/40 px-0 rounded-none focus-visible:ring-0 focus-visible:border-primary transition-all duration-300 text-lg font-heading tracking-wide placeholder:text-muted-foreground/30 ${errors.investment_thesis ? "border-destructive" : ""}`}
                    placeholder="Objasnite koje sinergije, tržišta ili operativne ciljeve želite postići akvizicijom."
                  />
                  {errors.investment_thesis ? (
                    <p className="text-xs text-destructive">{errors.investment_thesis.message}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Ovaj sažetak vide prodavatelji kada procjenjuju vaš NDA zahtjev.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col-reverse sm:flex-row justify-between gap-4 border-t border-border pt-8 px-8 md:px-10 pb-10">
        <Button
          type="button"
          variant="outline"
          onClick={handleBackStep}
          disabled={step === 1 || isPending}
          className="w-full sm:w-auto rounded-none transition-all duration-300 cursor-pointer hover:bg-card-elevated"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Natrag
        </Button>

        {step < 3 ? (
          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full sm:w-auto rounded-none bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 cursor-pointer"
          >
            {step === 1 ? "Financijska Strukturiranja" : "Investicijska Teza"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              const form = document.getElementById("buyer-onboarding-form") as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            disabled={isPending}
            className="w-full sm:w-auto rounded-none border border-primary/50 btn-shimmer bg-primary/10 text-primary-foreground hover:bg-primary/20 transition-all duration-500 cursor-pointer text-sm tracking-[0.1em] uppercase shadow-glow-gold"
          >
            {isPending ? "Aktivacija Pristupa..." : "Aktiviraj DealFlow Pristup"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
