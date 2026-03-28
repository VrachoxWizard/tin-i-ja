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
      // Create listing as draft and generate AI teaser in the background via API route
      const response = await fetch('/api/listings/create-teaser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit listing');
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
          <h2 className="text-3xl font-bold text-df-navy font-dm-sans">Uspješno zaprimljeno!</h2>
          <p className="text-slate-600 max-w-md">
            Vaši podaci su sigurno pohranjeni. Naša AI tehnologija trenutno generira vaš Slijepi Teaser. 
            Bit ćete preusmjereni na nadzornu ploču gdje ga možete pregledati i odobriti.
          </p>
          <Button variant="default" className="mt-8 bg-df-trust-blue hover:bg-df-trust-blue/90" onClick={() => window.location.href = '/dashboard/seller'}>
            Moja Nadzorna Ploča
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
          <ShieldCheck className="w-4 h-4" />
          100% Povjerljivo
        </div>
        <CardTitle className="text-2xl font-bold text-df-navy">Korak {step} od 3</CardTitle>
        <CardDescription>Unesite točne podatke za najbolju AI procjenu i izradu teasera.</CardDescription>
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
                  <Label>Naziv tvrtke (Neće biti prikazano kupcima)</Label>
                  <Input name="company_name" value={formData.company_name} onChange={handleChange} required placeholder="Npr. DealFlow d.o.o." />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Industrija (NKD sektor)</Label>
                    <Select value={formData.industry} onValueChange={(val) => handleSelectChange('industry', val)} required>
                      <SelectTrigger><SelectValue placeholder="Odaberite industriju" /></SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Regija</Label>
                    <Select value={formData.region} onValueChange={(val) => handleSelectChange('region', val)} required>
                      <SelectTrigger><SelectValue placeholder="Odaberite regiju" /></SelectTrigger>
                      <SelectContent>
                        {REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Godina osnivanja</Label>
                    <Input type="number" name="year_founded" value={formData.year_founded} onChange={handleChange} required placeholder="Npr. 2010" />
                  </div>
                  <div className="space-y-2">
                    <Label>Broj zaposlenika</Label>
                    <Input type="number" name="employees" value={formData.employees} onChange={handleChange} required placeholder="Npr. 15" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Godišnji prihod (EUR)</Label>
                    <Input type="number" name="revenue" value={formData.revenue} onChange={handleChange} required placeholder="500000" />
                  </div>
                  <div className="space-y-2">
                    <Label>EBITDA (EUR)</Label>
                    <Input type="number" name="ebitda" value={formData.ebitda} onChange={handleChange} required placeholder="100000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SDE - Diskrecijska zarada vlasnika (EUR) - Opicionalno</Label>
                  <Input type="number" name="sde" value={formData.sde} onChange={handleChange} placeholder="Najčešće više od EBITDA" />
                </div>

                <div className="space-y-2">
                  <Label>Željena cijena prodaje (EUR)</Label>
                  <Input type="number" name="asking_price" value={formData.asking_price} onChange={handleChange} required placeholder="Potrebno za teaser" />
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
                  <Label>Razlog prodaje</Label>
                  <Textarea 
                    name="reason_for_sale" 
                    value={formData.reason_for_sale} 
                    onChange={handleChange} 
                    required 
                    placeholder="Zašto prodajete tvrtku? (Npr. Umirovljenje, fokus na druge projekte...)"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Spremnost na prijelazni period (Tranzicija)</Label>
                  <Textarea 
                    name="transition_support" 
                    value={formData.transition_support} 
                    onChange={handleChange} 
                    required 
                    placeholder="Koliko dugo ste spremni ostati u tvrtki kako bi pomogli novom vlasniku? (Npr. 3 do 6 mjeseci uz savjetovanje)"
                    rows={3}
                  />
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
            {isLoading ? "Kriptiranje podataka..." : "Spremi & Generiraj Teaser"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
