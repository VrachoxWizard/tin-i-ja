"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Target, CheckCircle } from "lucide-react";
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
  "Sve Industrijske Grane",
];
const REGIONS = [
  "Grad Zagreb",
  "Zagrebačka",
  "Splitsko-dalmatinska",
  "Istarska",
  "Primorsko-goranska",
  "Osječko-baranjska",
  "Zadarska",
  "Cijela Hrvatska",
];

export function BuyerOnboardingForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    buyer_type: "",
    investment_min: "",
    investment_max: "",
    target_industries: "",
    target_regions: "",
    investment_thesis: "",
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
      const response = await fetch("/api/buyers/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit buyer profile");
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
      <Card className="border-white/10 bg-white/[0.02] border shadow-none max-w-2xl mx-auto text-center py-12 rounded-none relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--color-df-trust-blue) 0%, transparent 60%)",
          }}
        />
        <CardContent className="flex flex-col items-center justify-center space-y-6 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="p-5 bg-primary/10 rounded-none text-primary mb-2 ring-1 ring-primary/20"
          >
            <CheckCircle className="w-12 h-12" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground font-heading tracking-tight">
              Profil Spremljen!
            </h2>
            <p className="text-muted-foreground font-sans max-w-md mx-auto leading-relaxed">
              Vaši investicijski kriteriji su uspješno dodani u naš DealFlow
              Algoritam. Sada ste automatski povezani s oglasima koji odgovaraju
              vašem profilu.
            </p>
          </div>
          <Button
            variant="default"
            className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-heading rounded-none h-12 px-8"
            onClick={() => (window.location.href = "/listings")}
          >
            Pregledaj Tvrtke (Listings)
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/[0.02] border shadow-none relative overflow-hidden rounded-none">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-trust/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[hsl(var(--df-gold))]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 z-20 rounded-t-2xl overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "33.33%" }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <CardHeader className="pt-10 px-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-df-trust-blue mb-3">
          <Target className="w-4 h-4" />
          Pametni Algoritam
        </div>
        <CardTitle className="text-3xl font-bold text-foreground font-heading tracking-tight">
          Korak {step} od 3
        </CardTitle>
        <CardDescription className="text-base text-slate-500 dark:text-slate-400 font-inter mt-1">
          Definirajte svoje investicijske parametre.
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
                    Tip Investitora
                  </Label>
                  <Select
                    value={formData.buyer_type}
                    onValueChange={(val) =>
                      handleSelectChange("buyer_type", val)
                    }
                    required
                  >
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50">
                      <SelectValue placeholder="Odaberite tip" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-white/10 rounded-none font-sans text-foreground">
                      <SelectItem
                        value="individual"
                        className="focus:bg-white/5 cursor-pointer rounded-none"
                      >
                        Fizička osoba / Individualni Poduzetnik
                      </SelectItem>
                      <SelectItem
                        value="strategic"
                        className="focus:bg-white/5 cursor-pointer rounded-none"
                      >
                        Strateški Investitor (Tvrtka / Korporacija)
                      </SelectItem>
                      <SelectItem
                        value="financial"
                        className="focus:bg-white/5 cursor-pointer rounded-none"
                      >
                        Financijski Investitor (PE / VC Fond)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-muted-foreground font-medium">
                      Minimalna Investicija (EUR)
                    </Label>
                    <Input
                      type="number"
                      name="investment_min"
                      value={formData.investment_min}
                      onChange={handleChange}
                      required
                      placeholder="Npr. 50000"
                      className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-muted-foreground font-medium">
                      Maksimalna Investicija (EUR)
                    </Label>
                    <Input
                      type="number"
                      name="investment_max"
                      value={formData.investment_max}
                      onChange={handleChange}
                      required
                      placeholder="Npr. 2000000"
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
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-muted-foreground font-medium">
                    Primarni Sektor Interesa
                  </Label>
                  <Select
                    value={formData.target_industries}
                    onValueChange={(val) =>
                      handleSelectChange("target_industries", val)
                    }
                    required
                  >
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50">
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
                    Primarna Regija
                  </Label>
                  <Select
                    value={formData.target_regions}
                    onValueChange={(val) =>
                      handleSelectChange("target_regions", val)
                    }
                    required
                  >
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50">
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
                    Investicijska Teza i Motivacija
                  </Label>
                  <Textarea
                    name="investment_thesis"
                    value={formData.investment_thesis}
                    onChange={handleChange}
                    required
                    placeholder="Zašto kupujete tvrtku? (Npr. Širenje tržišnog udjela, akvizicija tehnologije, stabilan prihod za samostalan rad...)"
                    rows={5}
                    className="resize-none min-h-[120px] bg-white/5 border-white/10 rounded-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans text-foreground placeholder:text-muted-foreground/50 leading-relaxed p-4"
                  />
                  <p className="text-xs text-slate-500 font-medium">
                    Ova informacija pomaže prodavateljima da vas procijene prije
                    odobrenja NDA-a.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col-reverse sm:flex-row justify-between gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-6 px-8 pb-8 relative z-10">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1 || isLoading}
          className="w-full sm:w-auto font-heading rounded-none border border-white/10 bg-transparent hover:bg-white/5 transition-colors h-12 px-6"
        >
          Natrag
        </Button>
        {step < 3 ? (
          <Button
            onClick={handleNext}
            className="w-full sm:w-auto bg-foreground hover:bg-white/90 text-background font-heading rounded-none h-12 px-6"
          >
            Sljedeći Korak <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-heading rounded-none h-12 px-6"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Target className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Profiliranje..." : "Kreiraj Investicijski Profil"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
