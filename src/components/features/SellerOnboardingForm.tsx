"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { saveSellerListingAction, type ActionResult } from "@/app/actions/dealflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
import { INDUSTRIES, REGIONS } from "@/data/constants";

// Zod Schema referencing backend requirements
const sellerFormSchema = z.object({
  company_name: z.string().min(2, "Minimalno 2 znaka").max(120),
  industry: z.string().min(2, "Oblavezno odaberite industriju"),
  region: z.string().min(2, "Obavezno odaberite regiju"),
  year_founded: z.number().min(1900, "Neispravna godina").max(new Date().getFullYear()),
  employees: z.number().min(1, "Minimalno 1 zaposlenik"),
  revenue: z.number().min(0, "Ne može biti negativno"),
  ebitda: z.number().min(0, "Ne može biti negativno"),
  sde: z.number().min(0),
  asking_price: z.number().min(0, "Ne može biti negativno"),
  reason_for_sale: z.string().min(12, "Unesite najmanje 12 znakova"),
  transition_support: z.string().min(12, "Unesite najmanje 12 znakova"),
  owner_dependency_score: z.number().min(1).max(5),
  digital_maturity: z.number().min(1).max(5),
});

type SellerFormValues = z.infer<typeof sellerFormSchema>;

export function SellerOnboardingForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<SellerFormValues>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues: {
      company_name: "",
      industry: "",
      region: "",
      sde: 0,
      reason_for_sale: "",
      transition_support: "",
      owner_dependency_score: 3,
      digital_maturity: 3,
    },
    mode: "onTouched",
  });

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof SellerFormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ["company_name", "industry", "region", "year_founded", "employees"];
    } else if (step === 2) {
      fieldsToValidate = ["revenue", "ebitda", "sde", "asking_price"];
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

  const onSubmit = (data: SellerFormValues) => {
    const payload = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      payload.set(key, String(value));
    });

    startTransition(async () => {
      const nextResult = await saveSellerListingAction(payload);
      setResult(nextResult);

      if (nextResult.error) {
        toast.error(nextResult.error);
        return;
      }

      toast.success(
        nextResult.message || "Teaser je uspješno generiran.",
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
              Teaser je spreman za pregled.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vaš oglas je spremljen u statusu pregleda prodavatelja. Na
              dashboardu ga možete pregledati, potvrditi i tek tada objaviti u
              marketplaceu.
            </p>
            {result.publicCode ? (
              <p className="text-sm text-foreground">
                Javna šifra oglasa:{" "}
                <span className="font-semibold tracking-wider">{result.publicCode}</span>
              </p>
            ) : null}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard/seller">
              <Button className="h-12 px-8 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-[0.18em] text-xs">
                Otvori dashboard
              </Button>
            </Link>
            <Link href="/valuate">
              <Button variant="outline" className="h-12 px-8 rounded-none">
                Ponovi procjenu
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
          className="h-full bg-primary"
          initial={{ width: "33.33%" }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <CardHeader className="pt-12 px-8 md:px-10 border-b border-border pb-8">
        <div className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Povjerljivo i spremno za pregled
        </div>
        <CardTitle className="text-2xl md:text-3xl font-heading text-foreground tracking-tight">
          Korak {step} / 3
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-2 leading-relaxed">
          Unosite interne podatke koji ostaju skriveni kupcima dok ne odobrite
          teaser i dok NDA nije potpisan.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 md:px-10 pb-6 relative z-10 pt-8">
        <form id="seller-onboarding-form" onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="seller-step-1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label htmlFor="company_name">Naziv tvrtke</Label>
                  <Input
                    {...register("company_name")}
                    placeholder="Npr. Adria Industrija d.o.o."
                    className={`h-12 rounded-none ${errors.company_name ? "border-destructive" : ""}`}
                  />
                  {errors.company_name ? (
                    <p className="text-xs text-destructive">{errors.company_name.message}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Ovaj podatak koristi se interno, skriven u teaseru.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label>Industrija</Label>
                    <Controller
                      name="industry"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={`h-12 rounded-none ${errors.industry ? "border-destructive" : ""}`}>
                            <SelectValue placeholder="Odaberite industriju" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none">
                            {INDUSTRIES.map((ind) => (
                              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.industry && <p className="text-xs text-destructive">{errors.industry.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label>Regija</Label>
                    <Controller
                      name="region"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={`h-12 rounded-none ${errors.region ? "border-destructive" : ""}`}>
                            <SelectValue placeholder="Odaberite regiju" />
                          </SelectTrigger>
                          <SelectContent className="rounded-none">
                            {REGIONS.map((reg) => (
                              <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.region && <p className="text-xs text-destructive">{errors.region.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label htmlFor="year_founded">Godina osnivanja</Label>
                    <Input
                      {...register("year_founded", { valueAsNumber: true })}
                      type="number"
                      placeholder="2012"
                      className={`h-12 rounded-none ${errors.year_founded ? "border-destructive" : ""}`}
                    />
                    {errors.year_founded && <p className="text-xs text-destructive">{errors.year_founded.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="employees">Broj zaposlenih</Label>
                    <Input
                      {...register("employees", { valueAsNumber: true })}
                      type="number"
                      placeholder="18"
                      className={`h-12 rounded-none ${errors.employees ? "border-destructive" : ""}`}
                    />
                    {errors.employees && <p className="text-xs text-destructive">{errors.employees.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="seller-step-2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label htmlFor="revenue">Godišnji prihod (EUR)</Label>
                    <Input
                      {...register("revenue", { valueAsNumber: true })}
                      type="number"
                      placeholder="850000"
                      className={`h-12 rounded-none ${errors.revenue ? "border-destructive" : ""}`}
                    />
                    {errors.revenue && <p className="text-xs text-destructive">{errors.revenue.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="ebitda">EBITDA (EUR)</Label>
                    <Input
                      {...register("ebitda", { valueAsNumber: true })}
                      type="number"
                      placeholder="190000"
                      className={`h-12 rounded-none ${errors.ebitda ? "border-destructive" : ""}`}
                    />
                    {errors.ebitda && <p className="text-xs text-destructive">{errors.ebitda.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label htmlFor="sde">SDE (EUR)</Label>
                    <Input
                      {...register("sde", { valueAsNumber: true })}
                      type="number"
                      placeholder="220000"
                      className="h-12 rounded-none"
                    />
                    <p className="text-xs text-muted-foreground">Unesite iznos opcionalno ako ga pratite.</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="asking_price">Tražena cijena (EUR)</Label>
                    <Input
                      {...register("asking_price", { valueAsNumber: true })}
                      type="number"
                      placeholder="1200000"
                      className={`h-12 rounded-none ${errors.asking_price ? "border-destructive" : ""}`}
                    />
                    {errors.asking_price && <p className="text-xs text-destructive">{errors.asking_price.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="seller-step-3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <Label htmlFor="reason_for_sale">Razlog prodaje</Label>
                  <Textarea
                    {...register("reason_for_sale")}
                    rows={4}
                    className={`resize-none rounded-none ${errors.reason_for_sale ? "border-destructive" : ""}`}
                    placeholder="Npr. planirano umirovljenje i prijenos poslovanja..."
                  />
                  {errors.reason_for_sale && <p className="text-xs text-destructive">{errors.reason_for_sale.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="transition_support">Plan tranzicije</Label>
                  <Textarea
                    {...register("transition_support")}
                    rows={4}
                    className={`resize-none rounded-none ${errors.transition_support ? "border-destructive" : ""}`}
                    placeholder="Npr. vlasnik ostaje 6 mjeseci radi prijenosa odnosa..."
                  />
                  {errors.transition_support && <p className="text-xs text-destructive">{errors.transition_support.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 border border-border p-5">
                    <Label className="text-base">Ovisnost poslovanja o vlasniku</Label>
                    <Controller
                      name="owner_dependency_score"
                      control={control}
                      render={({ field }) => (
                        <Slider
                          value={[field.value]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(val) => field.onChange(Array.isArray(val) ? val[0] : val)}
                        />
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 - niska</span>
                      <span>5 - visoka</span>
                    </div>
                  </div>

                  <div className="space-y-4 border border-border p-5">
                    <Label className="text-base">Digitalna zrelost procesa</Label>
                    <Controller
                      name="digital_maturity"
                      control={control}
                      render={({ field }) => (
                        <Slider
                          value={[field.value]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(val) => field.onChange(Array.isArray(val) ? val[0] : val)}
                        />
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 - ručno</span>
                      <span>5 - sustav</span>
                    </div>
                  </div>
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
          className="w-full sm:w-auto rounded-none"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Natrag
        </Button>

        {step < 3 ? (
          <Button
            type="button"
            onClick={handleNextStep}
            className="w-full sm:w-auto rounded-none bg-foreground text-background hover:bg-foreground/90"
          >
            Sljedeći korak
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={() => {
              const form = document.getElementById("seller-onboarding-form") as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
            disabled={isPending}
            className="w-full sm:w-auto rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? "Generiranje teasera..." : "Spremi i generiraj teaser"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
