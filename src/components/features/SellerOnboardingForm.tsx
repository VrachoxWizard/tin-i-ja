"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const INDUSTRIES = [
  "IT i Softver", "Turizam i Ugostiteljstvo", "Proizvodnja", 
  "Građevina", "Trgovina i Logistika", "Usluge", "Zdravstvo", "Ostalo",
];
const REGIONS = [
  "Grad Zagreb", "Zagrebačka", "Splitsko-dalmatinska", "Istarska", 
  "Primorsko-goranska", "Osječko-baranjska", "Zadarska", "Ostalo",
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
      const response = await fetch('/api/listings/create-teaser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit listing');
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
      <Card className="border-df-trust-blue/20 bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl shadow-glass max-w-2xl mx-auto text-center py-12 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, var(--color-df-trust-blue) 0%, transparent 60%)" }} />
        <CardContent className="flex flex-col items-center justify-center space-y-6 relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="p-5 bg-df-trust-blue/10 rounded-full text-df-trust-blue mb-2 ring-1 ring-df-trust-blue/20">
            <CheckCircle className="w-12 h-12" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-jakarta tracking-tight">Uspješno zaprimljeno!</h2>
            <p className="text-slate-600 dark:text-slate-400 font-inter max-w-md mx-auto leading-relaxed">
              Vaši podaci su sigurno pohranjeni. Naša AI tehnologija trenutno generira vaš Slijepi Teaser. 
              Bit ćete preusmjereni na nadzornu ploču gdje ga možete pregledati i odobriti.
            </p>
          </div>
          <Button variant="default" className="mt-6 bg-df-trust-blue hover:bg-df-trust-blue/90 text-white font-jakarta rounded-xl shadow-lg hover:shadow-xl transition-all h-12 px-8" onClick={() => window.location.href = '/dashboard/seller'}>
            Moja Nadzorna Ploča
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-glass relative overflow-hidden rounded-2xl font-inter">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-df-trust-blue/10 dark:bg-df-trust-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-df-gold/10 dark:bg-df-gold/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800 z-20">
        <motion.div 
          className="h-full bg-df-trust-blue shadow-[0_0_10px_rgba(21,101,192,0.5)]"
          initial={{ width: '33.33%' }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <CardHeader className="pt-10 px-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-df-trust-blue mb-3">
          <ShieldCheck className="w-4 h-4" />
          100% Povjerljivo
        </div>
        <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white font-jakarta tracking-tight">Korak {step} od 3</CardTitle>
        <CardDescription className="text-base text-slate-500 dark:text-slate-400 font-inter mt-1">Unesite točne podatke za najbolju AI procjenu i izradu teasera.</CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-6 relative z-10">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Naziv tvrtke <span className="text-slate-400 font-normal">(Neće biti prikazano kupcima)</span></Label>
                  <Input name="company_name" value={formData.company_name} onChange={handleChange} required placeholder="Npr. DealFlow d.o.o." className="h-12 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all font-inter" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Industrija (NKD sektor)</Label>
                    <Select value={formData.industry} onValueChange={(val) => handleSelectChange('industry', val)} required>
                      <SelectTrigger className="h-12 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all"><SelectValue placeholder="Odaberite industriju" /></SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-700 rounded-xl font-inter">
                        {INDUSTRIES.map(i => <SelectItem key={i} value={i} className="focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Regija</Label>
                    <Select value={formData.region} onValueChange={(val) => handleSelectChange('region', val)} required>
                      <SelectTrigger className="h-12 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all"><SelectValue placeholder="Odaberite regiju" /></SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200 dark:border-slate-700 rounded-xl font-inter">
                        {REGIONS.map(r => <SelectItem key={r} value={r} className="focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Godina osnivanja</Label>
                    <Input type="number" name="year_founded" value={formData.year_founded} onChange={handleChange} required placeholder="Npr. 2010" className="h-12 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all font-inter" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Broj zaposlenika</Label>
                    <Input type="number" name="employees" value={formData.employees} onChange={handleChange} required placeholder="Npr. 15" className="h-12 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all font-inter" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Godišnji prihod (EUR)</Label>
                    <Input type="number" name="revenue" value={formData.revenue} onChange={handleChange} required placeholder="500000" className="h-12 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all font-inter" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">EBITDA (EUR)</Label>
                    <Input type="number" name="ebitda" value={formData.ebitda} onChange={handleChange} required placeholder="100000" className="h-12 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all font-inter" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">SDE - Zarada vlasnika (EUR) <span className="text-slate-400 font-normal">- Opcionalno</span></Label>
                  <Input type="number" name="sde" value={formData.sde} onChange={handleChange} placeholder="Najčešće više od EBITDA" className="h-12 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all font-inter" />
                </div>

                <div className="space-y-3 p-5 bg-df-navy/5 dark:bg-white/5 border border-df-navy/10 dark:border-white/10 rounded-xl">
                  <Label className="text-sm font-bold text-slate-900 dark:text-white">Željena cijena prodaje (EUR)</Label>
                  <Input type="number" name="asking_price" value={formData.asking_price} onChange={handleChange} required placeholder="Potrebno za teaser" className="h-12 bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all font-inter font-semibold text-lg" />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Razlog prodaje</Label>
                  <Textarea 
                    name="reason_for_sale" 
                    value={formData.reason_for_sale} 
                    onChange={handleChange} 
                    required 
                    placeholder="Zašto prodajete tvrtku? (Npr. Umirovljenje, fokus na druge projekte...)"
                    rows={4}
                    className="resize-none bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all font-inter leading-relaxed"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Spremnost na prijelazni period (Tranzicija)</Label>
                  <Textarea 
                    name="transition_support" 
                    value={formData.transition_support} 
                    onChange={handleChange} 
                    required 
                    placeholder="Koliko dugo ste spremni ostati u tvrtki kako bi pomogli novom vlasniku? (Npr. 3 do 6 mjeseci uz savjetovanje)"
                    rows={4}
                    className="resize-none bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-df-trust-blue/50 transition-all font-inter leading-relaxed"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col-reverse sm:flex-row justify-between gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-6 px-8 pb-8 relative z-10">
        <Button variant="outline" onClick={handleBack} disabled={step === 1 || isLoading} className="w-full sm:w-auto font-jakarta rounded-xl border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors h-12 px-6">
          Natrag
        </Button>
        {step < 3 ? (
          <Button onClick={handleNext} className="w-full sm:w-auto bg-df-navy hover:bg-df-navy/90 dark:bg-white dark:text-df-navy dark:hover:bg-slate-100 text-white font-jakarta rounded-xl shadow-md hover:shadow-lg transition-all h-12 px-6">
            Sljedeći Korak <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto bg-df-trust-blue hover:bg-df-trust-blue/90 text-white font-jakarta rounded-xl shadow-md hover:shadow-lg transition-all h-12 px-6">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
            {isLoading ? "Kriptiranje podataka..." : "Spremi & Generiraj Teaser"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
