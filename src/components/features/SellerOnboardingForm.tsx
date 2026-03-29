"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import { toast } from "sonner";
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

const INDUSTRIES = [
  "IT i Softver",
  "Turizam i Ugostiteljstvo",
  "Proizvodnja",
  "Građevina",
  "Trgovina i Logistika",
  "Usluge",
  "Zdravstvo",
  "Ostalo",
];
const REGIONS = [
  "Grad Zagreb",
  "Zagrebačka",
  "Splitsko-dalmatinska",
  "Istarska",
  "Primorsko-goranska",
  "Osječko-baranjska",
  "Zadarska",
  "Ostalo",
];

export function SellerOnboardingForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/listings/create-teaser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit listing");
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      toast.error("Dogodila se pogreška. Molimo pokušajte ponovno.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border border-white/5 bg-card rounded-none max-w-2xl mx-auto text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <CardContent className="flex flex-col items-center justify-center space-y-8 relative z-10">
          <div className="p-5 border border-primary/30 text-primary">
            <CheckCircle className="w-8 h-8" strokeWidth={1} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-heading text-foreground tracking-tighter leading-tight">
              Aplikacija zaprimljena.
            </h2>
            <p className="text-muted-foreground font-light max-w-md mx-auto leading-relaxed tracking-wide">
              Vaši podaci su sigurno pohranjeni. Naša AI tehnologija trenutno
              generira vaš Slijepi Teaser. Bit ćete preusmjereni na nadzornu
              ploču gdje ga možete pregledati i odobriti.
            </p>
          </div>
          <Button
            className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-14 px-10 text-[0.75rem] font-bold tracking-[0.2em] uppercase transition-all"
            onClick={() => (window.location.href = "/dashboard/seller")}
          >
            Nadzorna Ploča
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/5 bg-card/50 backdrop-blur-md rounded-none relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-20">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "33.33%" }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <CardHeader className="pt-12 px-10 border-b border-white/5 pb-8">
        <div className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Povjerljivo & Kriptirano
        </div>
        <CardTitle className="text-2xl md:text-3xl font-heading text-foreground tracking-tighter">
          Korak {step} / 3
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground font-light mt-2 tracking-wide">
          Unesite točne podatke za najbolju AI procjenu i izradu teasera.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-6 relative z-10">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-muted-foreground font-medium">
                    Naziv tvrtke{" "}
                    <span className="text-muted-foreground/70 font-normal">
                      (Neće biti prikazano kupcima)
                    </span>
                  </Label>
                  <Input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                    placeholder="Npr. DealFlow d.o.o."
                    className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-muted-foreground font-medium">
                      Industrija (NKD sektor)
                    </Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(val) =>
                        handleSelectChange("industry", val)
                      }
                      required
                    >
                      <SelectTrigger className="h-12 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all">
                        <SelectValue placeholder="Odaberite industriju" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-white/10 rounded-none font-sans text-foreground">
                        {INDUSTRIES.map((i) => (
                          <SelectItem
                            key={i}
                            value={i}
                            className="focus:bg-white/5 cursor-pointer rounded-none"
                          >
                            {i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-muted-foreground font-medium">
                      Regija
                    </Label>
                    <Select
                      value={formData.region}
                      onValueChange={(val) => handleSelectChange("region", val)}
                      required
                    >
                      <SelectTrigger className="h-12 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all">
                        <SelectValue placeholder="Odaberite regiju" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border border-white/10 rounded-none font-sans text-foreground">
                        {REGIONS.map((r) => (
                          <SelectItem
                            key={r}
                            value={r}
                            className="focus:bg-white/5 cursor-pointer rounded-none"
                          >
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-muted-foreground font-medium">
                      Godina osnivanja
                    </Label>
                    <Input
                      type="number"
                      name="year_founded"
                      value={formData.year_founded}
                      onChange={handleChange}
                      required
                      placeholder="Npr. 2010"
                      className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-muted-foreground font-medium">
                      Broj zaposlenika
                    </Label>
                    <Input
                      type="number"
                      name="employees"
                      value={formData.employees}
                      onChange={handleChange}
                      required
                      placeholder="Npr. 15"
                      className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-muted-foreground font-medium">
                      Godišnji prihod (EUR)
                    </Label>
                    <Input
                      type="number"
                      name="revenue"
                      value={formData.revenue}
                      onChange={handleChange}
                      required
                      placeholder="500000"
                      className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-muted-foreground font-medium">
                      EBITDA (EUR)
                    </Label>
                    <Input
                      type="number"
                      name="ebitda"
                      value={formData.ebitda}
                      onChange={handleChange}
                      required
                      placeholder="100000"
                      className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-muted-foreground font-medium">
                    SDE - Zarada vlasnika (EUR){" "}
                    <span className="text-muted-foreground/70 font-normal">
                      - Opcionalno
                    </span>
                  </Label>
                  <Input
                    type="number"
                    name="sde"
                    value={formData.sde}
                    onChange={handleChange}
                    placeholder="Najčešće više od EBITDA"
                    className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>

                <div className="space-y-4 p-6 bg-white/[0.02] border border-white/10 relative">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <Label className="text-xs font-bold uppercase tracking-[0.15em] text-foreground">
                    Željena cijena prodaje (EUR)
                  </Label>
                  <Input
                    type="number"
                    name="asking_price"
                    value={formData.asking_price}
                    onChange={handleChange}
                    required
                    placeholder="Potrebno za teaser"
                    className="h-14 bg-background border-white/20 rounded-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-heading font-medium text-xl text-foreground placeholder:text-muted-foreground/30 px-6"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-muted-foreground font-medium">
                    Razlog prodaje
                  </Label>
                  <Textarea
                    name="reason_for_sale"
                    value={formData.reason_for_sale}
                    onChange={handleChange}
                    required
                    placeholder="Zašto prodajete tvrtku? (Npr. Umirovljenje, fokus na druge projekte...)"
                    rows={4}
                    className="resize-none min-h-[120px] bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50 leading-relaxed p-4"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-muted-foreground font-medium">
                    Spremnost na prijelazni period (Tranzicija)
                  </Label>
                  <Textarea
                    name="transition_support"
                    value={formData.transition_support}
                    onChange={handleChange}
                    required
                    placeholder="Koliko dugo ste spremni ostati u tvrtki kako bi pomogli novom vlasniku? (Npr. 3 do 6 mjeseci uz savjetovanje)"
                    rows={4}
                    className="resize-none min-h-[120px] bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50 leading-relaxed p-4"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col-reverse sm:flex-row justify-between gap-4 border-t border-white/5 pt-8 px-10 pb-10 relative z-10">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1 || isLoading}
          className="w-full sm:w-auto rounded-none border-white/10 bg-transparent hover:bg-white/5 text-[0.75rem] font-bold tracking-[0.2em] uppercase transition-all h-14 px-10"
        >
          Natrag
        </Button>
        {step < 3 ? (
          <Button
            onClick={handleNext}
            className="w-full sm:w-auto bg-white text-black hover:bg-white/90 rounded-none text-[0.75rem] font-bold tracking-[0.2em] uppercase transition-all h-14 px-10"
          >
            Sljedeći Korak <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[0.75rem] font-bold tracking-[0.2em] uppercase transition-all h-14 px-10"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4 mr-2" />
            )}
            {isLoading
              ? "Kriptiranje..."
              : "Spremi & Generiraj"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
