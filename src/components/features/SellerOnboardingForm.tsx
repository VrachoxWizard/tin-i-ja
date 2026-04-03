"use client";

import { useMemo, useState, useTransition } from "react";
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

export function SellerOnboardingForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    region: "",
    year_founded: "",
    employees: "",
    revenue: "",
    ebitda: "",
    sde: "",
    asking_price: "",
    reason_for_sale: "",
    transition_support: "",
    owner_dependency_score: 3,
    digital_maturity: 3,
  });

  const stepValidity = useMemo(
    () => ({
      1:
        formData.company_name.trim().length >= 2 &&
        formData.industry &&
        formData.region &&
        formData.year_founded &&
        formData.employees,
      2:
        formData.revenue &&
        formData.ebitda &&
        formData.asking_price &&
        Number(formData.asking_price) >= 0,
      3:
        formData.reason_for_sale.trim().length >= 12 &&
        formData.transition_support.trim().length >= 12,
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
      toast.error("Prije nastavka ispunite sva obavezna polja u ovom koraku.");
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
      toast.error("Dodajte razlog prodaje i plan tranzicije prije slanja.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
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
        nextResult.message ||
          "Teaser je generiran. Pregledajte ga prije objave u marketplaceu.",
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

      <CardContent className="px-8 md:px-10 pb-6 relative z-10">
        <form id="seller-onboarding-form" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
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
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Npr. Adria Industrija d.o.o."
                    className="h-12 rounded-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ovaj podatak koristi se samo interno i nikad se ne prikazuje
                    u blind teaseru.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label>Industrija</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) =>
                        handleSelectChange("industry", value)
                      }
                    >
                      <SelectTrigger className="h-12 rounded-none">
                        <SelectValue placeholder="Odaberite industriju" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Regija</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) =>
                        handleSelectChange("region", value)
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label htmlFor="year_founded">Godina osnivanja</Label>
                    <Input
                      id="year_founded"
                      name="year_founded"
                      type="number"
                      value={formData.year_founded}
                      onChange={handleChange}
                      placeholder="2012"
                      className="h-12 rounded-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="employees">Broj zaposlenih</Label>
                    <Input
                      id="employees"
                      name="employees"
                      type="number"
                      value={formData.employees}
                      onChange={handleChange}
                      placeholder="18"
                      className="h-12 rounded-none"
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}

            {step === 2 ? (
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
                      id="revenue"
                      name="revenue"
                      type="number"
                      value={formData.revenue}
                      onChange={handleChange}
                      placeholder="850000"
                      className="h-12 rounded-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="ebitda">EBITDA (EUR)</Label>
                    <Input
                      id="ebitda"
                      name="ebitda"
                      type="number"
                      value={formData.ebitda}
                      onChange={handleChange}
                      placeholder="190000"
                      className="h-12 rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label htmlFor="sde">SDE (EUR)</Label>
                    <Input
                      id="sde"
                      name="sde"
                      type="number"
                      value={formData.sde}
                      onChange={handleChange}
                      placeholder="220000"
                      className="h-12 rounded-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Unesite ako ga pratite. Ako ne, procjena se i dalje može
                      napraviti.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="asking_price">Tražena cijena (EUR)</Label>
                    <Input
                      id="asking_price"
                      name="asking_price"
                      type="number"
                      value={formData.asking_price}
                      onChange={handleChange}
                      placeholder="1200000"
                      className="h-12 rounded-none"
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}

            {step === 3 ? (
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
                    id="reason_for_sale"
                    name="reason_for_sale"
                    value={formData.reason_for_sale}
                    onChange={handleChange}
                    rows={4}
                    className="resize-none rounded-none"
                    placeholder="Npr. planirano umirovljenje i prijenos poslovanja uz očuvanje tima."
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="transition_support">Plan tranzicije</Label>
                  <Textarea
                    id="transition_support"
                    name="transition_support"
                    value={formData.transition_support}
                    onChange={handleChange}
                    rows={4}
                    className="resize-none rounded-none"
                    placeholder="Npr. vlasnik ostaje 6 mjeseci radi prijenosa odnosa s klijentima i procesa."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 border border-border p-5">
                    <Label className="text-base">Ovisnost poslovanja o vlasniku</Label>
                    <Slider
                      value={[formData.owner_dependency_score]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          owner_dependency_score: Array.isArray(value)
                            ? (value[0] ?? 3)
                            : value,
                        }))
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 - niska</span>
                      <span>5 - visoka</span>
                    </div>
                  </div>

                  <div className="space-y-4 border border-border p-5">
                    <Label className="text-base">Digitalna zrelost procesa</Label>
                    <Slider
                      value={[formData.digital_maturity]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          digital_maturity: Array.isArray(value)
                            ? (value[0] ?? 3)
                            : value,
                        }))
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 - ručno</span>
                      <span>5 - strukturirano</span>
                    </div>
                  </div>
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
                  "seller-onboarding-form",
                ) as HTMLFormElement | null
              )?.requestSubmit();
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
