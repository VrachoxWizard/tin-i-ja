"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Factory,
  Lock,
  Monitor,
  Palmtree,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { ValuationResponse } from "@/lib/contracts";
import { sanitizeHtml } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { VALUATOR_INDUSTRIES } from "@/data/constants";

const INDUSTRIES = [
  { id: VALUATOR_INDUSTRIES[0], label: "IT i Softver", icon: Monitor },
  { id: VALUATOR_INDUSTRIES[1], label: "Turizam i Ugostiteljstvo", icon: Palmtree },
  { id: VALUATOR_INDUSTRIES[2], label: "Trgovina i Logistika", icon: ShoppingCart },
  { id: VALUATOR_INDUSTRIES[3], label: "Proizvodnja", icon: Factory },
  { id: VALUATOR_INDUSTRIES[4], label: "Usluge", icon: Briefcase },
];

const stepVariants: Variants = {
  hidden: { opacity: 0, x: 32, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
  exit: {
    opacity: 0,
    x: -32,
    filter: "blur(4px)",
    transition: { duration: 0.2 },
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ValuatorWizard() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<ValuationResponse | null>(null);
  const [formData, setFormData] = useState({
    industry: "",
    revenue: "",
    ebitda: "",
    sde: "",
    dependency: 3,
    maturity: 3,
  });

  const stepValidity = useMemo(
    () => ({
      1: !!formData.industry,
      2:
        Number(formData.revenue) > 0 &&
        Number(formData.ebitda) >= 0 &&
        Number(formData.sde) >= 0,
      3: formData.dependency >= 1 && formData.maturity >= 1,
    }),
    [formData],
  );

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const interval = setInterval(() => {
      setLoadingProgress((current) => {
        if (current >= 96) {
          return current;
        }
        return current + 4;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isLoading]);

  const goNext = () => {
    if (!stepValidity[step as keyof typeof stepValidity]) {
      toast.error("Dovršite obavezna polja u ovom koraku prije nastavka.");
      return;
    }

    setStep((current) => Math.min(current + 1, 3));
  };

  const goBack = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = async () => {
    if (!stepValidity[3]) {
      toast.error("Provjerite kvalitativne faktore prije generiranja analize.");
      return;
    }

    setIsLoading(true);
    setLoadingProgress(8);
    setResult(null);
    setStep(4);

    try {
      const response = await fetch("/api/valuate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: formData.industry,
          revenue: Number(formData.revenue),
          ebitda: Number(formData.ebitda),
          sde: Number(formData.sde),
          dependency: formData.dependency,
          maturity: formData.maturity,
        }),
      });

      const payload = (await response.json()) as
        | ValuationResponse
        | { error?: string };
      const errorMessage = "error" in payload ? payload.error : undefined;

      if (!response.ok || errorMessage) {
        throw new Error(errorMessage || "Procjena nije uspjela.");
      }

      setLoadingProgress(100);
      setResult(payload as ValuationResponse);
      setStep(5);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Procjena nije uspjela. Pokušajte ponovno.",
      );
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative z-20">
      {step < 4 ? (
        <div className="mb-10 px-2 text-center">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-df-trust-blue"
              initial={{ width: "33.33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
          <div className="flex items-center justify-center text-xs text-muted-foreground uppercase tracking-widest gap-2">
            <Lock className="size-3" />
            Vaši podaci ostaju povjerljivi · korak {step} od 3
          </div>
        </div>
      ) : null}

      <div className="w-full bg-card border border-border rounded-none overflow-hidden">
        <div className="pt-10 px-8 sm:px-12 relative z-10 min-h-[34rem] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="valuate-step-1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8 pb-10"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
                    Koja je primarna djelatnost vaše tvrtke?
                  </h2>
                  <p className="text-muted-foreground">
                    Sektor određuje referentne multiplikatore i način na koji
                    kupci gledaju na vrijednost poslovanja.
                  </p>
                </div>

                <div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  role="radiogroup"
                  aria-label="Odaberite djelatnost"
                >
                  {INDUSTRIES.map((industry) => (
                    <button
                      key={industry.id}
                      type="button"
                      role="radio"
                      aria-checked={formData.industry === industry.id}
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          industry: industry.id,
                        }))
                      }
                      className={`cursor-pointer border p-5 rounded-none flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 ${
                        formData.industry === industry.id
                          ? "border-primary bg-primary/8 ring-1 ring-primary"
                          : "border-border hover:border-primary/30 hover:bg-muted/30"
                      }`}
                    >
                      <industry.icon
                        className={`size-8 ${
                          formData.industry === industry.id
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold tracking-wide ${
                          formData.industry === industry.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {industry.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                key="valuate-step-2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8 pb-10"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
                    Financijski pokazatelji
                  </h2>
                  <p className="text-muted-foreground">
                    Unesite podatke za posljednjih 12 mjeseci poslovanja.
                  </p>
                </div>

                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Godišnji prihodi (EUR)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={formData.revenue}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          revenue: event.target.value,
                        }))
                      }
                      className="h-14 rounded-none"
                      placeholder="1000000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ebitda">EBITDA (EUR)</Label>
                    <Input
                      id="ebitda"
                      type="number"
                      value={formData.ebitda}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          ebitda: event.target.value,
                        }))
                      }
                      className="h-14 rounded-none"
                      placeholder="250000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sde">SDE (EUR)</Label>
                    <Input
                      id="sde"
                      type="number"
                      value={formData.sde}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          sde: event.target.value,
                        }))
                      }
                      className="h-14 rounded-none"
                      placeholder="300000"
                    />
                    <p className="text-xs text-muted-foreground">
                      SDE je korisna metrika za owner-operated biznise i daje
                      dodatni raspon procjene uz EBITDA metodologiju.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {step === 3 ? (
              <motion.div
                key="valuate-step-3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10 pb-10"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
                    Kvalitativni faktori
                  </h2>
                  <p className="text-muted-foreground">
                    Ovi faktori najviše utječu na spremnost tvrtke za prodajni
                    proces i povjerenje investitora.
                  </p>
                </div>

                <div className="space-y-10 max-w-xl mx-auto">
                  <div className="space-y-6 bg-muted/20 border border-border p-6 rounded-none">
                    <div>
                      <Label className="text-base font-semibold text-foreground">
                        Ovisnost poslovanja o vlasniku
                      </Label>
                      <p className="text-sm text-muted-foreground mt-2">
                        Može li tvrtka funkcionirati bez vašeg svakodnevnog
                        operativnog angažmana?
                      </p>
                    </div>
                    <Slider
                      value={[formData.dependency]}
                      max={5}
                      min={1}
                      step={1}
                      onValueChange={(value) =>
                        setFormData((current) => ({
                          ...current,
                          dependency: Array.isArray(value)
                            ? (value[0] ?? 3)
                            : value,
                        }))
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-widest">
                      <span>1 · niska</span>
                      <span>5 · potpuna</span>
                    </div>
                  </div>

                  <div className="space-y-6 bg-muted/20 border border-border p-6 rounded-none">
                    <div>
                      <Label className="text-base font-semibold text-foreground">
                        Digitalna zrelost i procesi
                      </Label>
                      <p className="text-sm text-muted-foreground mt-2">
                        Koliko su financije, operativa i izvještavanje
                        standardizirani i dokumentirani?
                      </p>
                    </div>
                    <Slider
                      value={[formData.maturity]}
                      max={5}
                      min={1}
                      step={1}
                      onValueChange={(value) =>
                        setFormData((current) => ({
                          ...current,
                          maturity: Array.isArray(value)
                            ? (value[0] ?? 3)
                            : value,
                        }))
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-widest">
                      <span>1 · ručno</span>
                      <span>5 · strukturirano</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {step === 4 ? (
              <motion.div
                key="valuate-step-4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="py-20 flex flex-col items-center justify-center text-center"
              >
                <div className="relative size-28 mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.35, 1.8], opacity: [0.35, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-primary/20"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-t-primary border-r-df-trust-blue/40 border-b-df-trust-blue/10 border-l-transparent"
                  />
                  <div className="absolute inset-0 m-2 rounded-full bg-background flex items-center justify-center">
                    <Sparkles className="size-8 text-primary" />
                  </div>
                </div>

                <h3 className="text-2xl font-heading font-semibold text-foreground mb-3">
                  Generiramo inicijalnu procjenu
                </h3>
                <p className="text-muted-foreground mb-8 max-w-sm">
                  Uspoređujemo vaše pokazatelje s tipičnim tržišnim rasponima i
                  procjenjujemo sell-readiness score.
                </p>

                <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-df-trust-blue rounded-full transition-all duration-150"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="mt-3 text-sm font-mono text-primary font-semibold">
                  {loadingProgress}%
                </div>
              </motion.div>
            ) : null}

            {step === 5 && result ? (
              <motion.div
                key="valuate-step-5"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10 pb-6"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 text-emerald-600 rounded-full mb-5">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h2 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
                    Vaša inicijalna procjena
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Ovo je prvi orijentacijski raspon temeljen na unesenim
                    podacima i AI analizi spremnosti za prodajni proces.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-border bg-muted/20 rounded-none p-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                      SDE raspon
                    </p>
                    <p className="text-xl font-heading text-foreground">
                      {formatCurrency(result.ranges.sde[0])}
                    </p>
                    <p className="text-sm text-muted-foreground my-2">do</p>
                    <p className="text-xl font-heading text-foreground">
                      {formatCurrency(result.ranges.sde[1])}
                    </p>
                  </div>

                  <div className="border border-border bg-muted/20 rounded-none p-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                      EBITDA raspon
                    </p>
                    <p className="text-xl font-heading text-foreground">
                      {formatCurrency(result.ranges.ebitda[0])}
                    </p>
                    <p className="text-sm text-muted-foreground my-2">do</p>
                    <p className="text-xl font-heading text-foreground">
                      {formatCurrency(result.ranges.ebitda[1])}
                    </p>
                  </div>

                  <div className="border border-border bg-primary/8 rounded-none p-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                      Sell-readiness
                    </p>
                    <p className="text-4xl font-heading text-primary">
                      {result.sellReadinessScore}
                    </p>
                    <p className="text-sm text-muted-foreground mt-3">
                      Rezultat spremnosti za strukturirani izlazak na tržište.
                    </p>
                  </div>
                </div>

                <div
                  className="prose max-w-none text-muted-foreground prose-headings:font-heading prose-headings:text-foreground leading-relaxed p-6 bg-muted/20 rounded-none border border-border"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(result.reportHtml),
                  }}
                />

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  <Link href="/sell" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90 h-14 px-10 uppercase tracking-[0.18em] text-xs">
                      Pokreni prodajni proces
                      <ArrowRight className="ml-2 size-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto rounded-none h-14 px-8"
                  >
                    Ponovi izračun
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {step < 4 ? (
          <div className="flex justify-between items-center p-6 sm:px-12 border-t border-border bg-muted/20">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={step === 1}
              className={`rounded-none h-12 px-6 ${
                step === 1 ? "invisible" : ""
              }`}
            >
              <ArrowLeft className="mr-2 size-4" />
              Natrag
            </Button>

            {step < 3 ? (
              <Button
                onClick={goNext}
                className="rounded-none h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sljedeće
                <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="rounded-none h-12 px-8 bg-df-trust-blue text-white hover:bg-df-trust-blue/90"
              >
                Generiraj analizu
                <Sparkles className="ml-2 size-4" />
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
