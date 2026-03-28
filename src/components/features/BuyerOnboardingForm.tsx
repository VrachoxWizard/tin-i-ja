"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck, CheckCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const INDUSTRIES = [
  "IT i Softver", "Turizam i Ugostiteljstvo", "Proizvodnja", 
  "Građevina", "Trgovina i Logistika", "Usluge", "Zdravstvo", "Sve Industrijske Grane",
];
const REGIONS = [
  "Grad Zagreb", "Zagrebačka", "Splitsko-dalmatinska", "Istarska", 
  "Primorsko-goranska", "Osječko-baranjska", "Zadarska", "Cijela Hrvatska",
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
    investment_thesis: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await fetch('/api/buyers/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit buyer profile');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Dogodila se pogreška. Molimo pokušajte ponovno.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-df-trust-blue/20 bg-white/80 backdrop-blur-xl shadow-xl max-w-2xl mx-auto text-center py-12">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-4 bg-green-100 rounded-full text-green-600 mb-4">
            <CheckCircle className="w-12 h-12" />
          </motion.div>
          <h2 className="text-3xl font-bold text-df-navy font-dm-sans">Profil Spremljen!</h2>
          <p className="text-slate-600 max-w-md">
            Vaši investicijski kriteriji su uspješno dodani u naš DealFlow Algoritam. 
            Sada ste automatski povezani s oglasima koji odgovaraju vašem profilu.
          </p>
          <Button variant="default" className="mt-8 bg-df-trust-blue hover:bg-df-trust-blue/90" onClick={() => window.location.href = '/listings'}>
            Pregledaj Tvrtke (Listings)
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/50 bg-white/70 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-df-trust-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-df-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
        <motion.div 
          className="h-full bg-df-trust-blue"
          initial={{ width: '33.33%' }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <CardHeader>
        <div className="flex items-center gap-2 text-sm font-medium text-df-trust-blue mb-2">
          <Target className="w-4 h-4" />
          Pametni Algoritam
        </div>
        <CardTitle className="text-2xl font-bold text-df-navy">Korak {step} od 3</CardTitle>
        <CardDescription>Definirajte svoje investicijske parametre.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label>Tip Investitora</Label>
                  <Select value={formData.buyer_type} onValueChange={(val) => handleSelectChange('buyer_type', val)} required>
                    <SelectTrigger><SelectValue placeholder="Odaberite tip" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Fizička osoba / Individualni Poduzetnik</SelectItem>
                      <SelectItem value="strategic">Strateški Investitor (Tvrtka / Korporacija)</SelectItem>
                      <SelectItem value="financial">Financijski Investitor (PE / VC Fond)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimalna Investicija (EUR)</Label>
                    <Input type="number" name="investment_min" value={formData.investment_min} onChange={handleChange} required placeholder="Npr. 50000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maksimalna Investicija (EUR)</Label>
                    <Input type="number" name="investment_max" value={formData.investment_max} onChange={handleChange} required placeholder="Npr. 2000000" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label>Primarni Sektor Interesa</Label>
                  <Select value={formData.target_industries} onValueChange={(val) => handleSelectChange('target_industries', val)} required>
                    <SelectTrigger><SelectValue placeholder="Odaberite industriju" /></SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Primarna Regija</Label>
                  <Select value={formData.target_regions} onValueChange={(val) => handleSelectChange('target_regions', val)} required>
                    <SelectTrigger><SelectValue placeholder="Odaberite regiju" /></SelectTrigger>
                    <SelectContent>
                      {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label>Investicijska Teza i Motivacija</Label>
                  <Textarea 
                    name="investment_thesis" 
                    value={formData.investment_thesis} 
                    onChange={handleChange} 
                    required 
                    placeholder="Zašto kupujete tvrtku? (Npr. Širenje tržišnog udjela, akvizicija tehnologije, stabilan prihod za samostalan rad...)"
                    rows={4}
                  />
                  <p className="text-xs text-slate-500">Ova informacija pomaže prodavateljima da vas procijene prije odobrenja NDA-a.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
        <Button variant="outline" onClick={handleBack} disabled={step === 1 || isLoading}>
          Natrag
        </Button>
        {step < 3 ? (
          <Button onClick={handleNext} className="bg-df-navy hover:bg-df-navy/90">
            Sljedeći Korak <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-df-trust-blue hover:bg-df-trust-blue/90">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
            {isLoading ? "Profiliranje..." : "Kreiraj Investicijski Profil"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
