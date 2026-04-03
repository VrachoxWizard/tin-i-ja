"use client";

import { useMemo, useState, useTransition } from "react";
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

export function BuyerOnboardingForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    buyer_type: "",
    target_ev_min: "",
    target_ev_max: "",
    target_revenue_min: "",
    target_revenue_max: "",
    target_industries: "",
    target_regions: "",
    investment_thesis: "",
  });

  const stepValidity = useMemo(
    () => ({
      1:
        !!formData.buyer_type &&
        !!formData.target_ev_min &&
        !!formData.target_ev_max &&
        Number(formData.target_ev_min) <= Number(formData.target_ev_max),
      2:
        !!formData.target_revenue_min &&
        !!formData.target_revenue_max &&
        !!formData.target_industries &&
        !!formData.target_regions &&
        Number(formData.target_revenue_min) <=
          Number(formData.target_revenue_max),
      3: formData.investment_thesis.trim().length >= 12,
    }),
    [formData],
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const handleNext = () => {
    if (!stepValidity[step as keyof typeof stepValidity]) {
      toast.error("Dovršite sva obavezna polja u ovom koraku prije nastavka.");
      return;
    }

    setStep((current) => Math.min(current + 1, 3));
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stepValidity[3]) {
      toast.error("Opišite svoju investicijsku tezu prije spremanja profila.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.set(key, value);
    });

    startTransition(async () => {
      const nextResult = await saveBuyerProfileAction(payload);
      setResult(nextResult);

      if (nextResult.error) {
        toast.error(nextResult.error);
        return;
      }

      toast.success(
        nextResult.message ||
          "Investicijski profil je spremljen i uparivanja su ažurirana.",
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
              Vaši kriteriji su spremljeni i DealFlow sada može automatski
              izračunavati podudaranja s novim aktivnim prilikama.
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
          className="h-full bg-primary"
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
          kako bi algoritam mogao filtrirati relevantne prilike.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 md:px-10 pb-6 relative z-10">
        <form id="buyer-onboarding-form" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
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
                  <Select
                    value={formData.buyer_type}
                    onValueChange={(value) =>
                      handleSelectChange("buyer_type", value)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-none">
                      <SelectValue placeholder="Odaberite profil investitora" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="individual">
                        Fizička osoba / poduzetnik
                      </SelectItem>
                      <SelectItem value="strategic">
                        Strateški investitor
                      </SelectItem>
                      <SelectItem value="financial">
                        Financijski investitor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label htmlFor="target_ev_min">Minimalni EV (EUR)</Label>
                    <Input
                      id="target_ev_min"
                      name="target_ev_min"
                      type="number"
                      value={formData.target_ev_min}
                      onChange={handleChange}
                      placeholder="150000"
                      className="h-12 rounded-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="target_ev_max">Maksimalni EV (EUR)</Label>
                    <Input
                      id="target_ev_max"
                      name="target_ev_max"
                      type="number"
                      value={formData.target_ev_max}
                      onChange={handleChange}
                      placeholder="2500000"
                      className="h-12 rounded-none"
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  EV raspon koristimo kao najvažniji signal za algoritamsko
                  uparivanje s aktivnim oglasima.
                </p>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                key="buyer-step-2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label htmlFor="target_revenue_min">
                      Minimalni prihod (EUR)
                    </Label>
                    <Input
                      id="target_revenue_min"
                      name="target_revenue_min"
                      type="number"
                      value={formData.target_revenue_min}
                      onChange={handleChange}
                      placeholder="300000"
                      className="h-12 rounded-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="target_revenue_max">
                      Maksimalni prihod (EUR)
                    </Label>
                    <Input
                      id="target_revenue_max"
                      name="target_revenue_max"
                      type="number"
                      value={formData.target_revenue_max}
                      onChange={handleChange}
                      placeholder="5000000"
                      className="h-12 rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label>Primarni sektor interesa</Label>
                    <Select
                      value={formData.target_industries}
                      onValueChange={(value) =>
                        handleSelectChange("target_industries", value)
                      }
                    >
                      <SelectTrigger className="h-12 rounded-none">
                        <SelectValue placeholder="Odaberite sektor" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {BUYER_INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Primarna regija</Label>
                    <Select
                      value={formData.target_regions}
                      onValueChange={(value) =>
                        handleSelectChange("target_regions", value)
                      }
                    >
                      <SelectTrigger className="h-12 rounded-none">
                        <SelectValue placeholder="Odaberite regiju" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {REGIONS.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div
                key="buyer-step-3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label htmlFor="investment_thesis">
                    Investicijska teza i motivacija
                  </Label>
                  <Textarea
                    id="investment_thesis"
                    name="investment_thesis"
                    value={formData.investment_thesis}
                    onChange={handleChange}
                    rows={5}
                    className="resize-none rounded-none"
                    placeholder="Objasnite koje sinergije, tržišta ili operativne ciljeve želite postići ovom akvizicijom."
                  />
                  <p className="text-xs text-muted-foreground">
                    Ovaj sažetak vide prodavatelji kada procjenjuju NDA zahtjev.
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col-reverse sm:flex-row justify-between gap-4 border-t border-border pt-8 px-8 md:px-10 pb-10">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1 || isPending}
          className="w-full sm:w-auto rounded-none"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Natrag
        </Button>

        {step < 3 ? (
          <Button
            onClick={handleNext}
            className="w-full sm:w-auto rounded-none bg-foreground text-background hover:bg-foreground/90"
          >
            Sljedeći korak
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => {
              (
                document.getElementById(
                  "buyer-onboarding-form",
                ) as HTMLFormElement | null
              )?.requestSubmit();
            }}
            disabled={isPending}
            className="w-full sm:w-auto rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? "Spremanje profila..." : "Spremi investicijski profil"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
