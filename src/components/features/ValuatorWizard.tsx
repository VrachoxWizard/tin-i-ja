"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { GlowCard } from "@/components/ui/GlowCard";
import Link from "next/link";
import {
  Monitor,
  Palmtree,
  ShoppingCart,
  Factory,
  Briefcase,
  Lock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const INDUSTRIES = [
  { id: "IT_Software", label: "IT i Softver", icon: Monitor },
  { id: "Turizam", label: "Turizam", icon: Palmtree },
  { id: "Trgovina", label: "Trgovina", icon: ShoppingCart },
  { id: "Proizvodnja", label: "Proizvodnja", icon: Factory },
  { id: "Usluge", label: "Usluge", icon: Briefcase },
];

export function ValuatorWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<{
    html: string;
    ranges: Record<string, [number, number]>;
  } | null>(null);

  const [formData, setFormData] = useState({
    industry: "",
    revenue: 0,
    ebitda: 0,
    sde: 0,
    dependency: 3,
    maturity: 3,
  });

  // Simulated loading progress for the "Generating" step
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoadingProgress(0);
    setLoading(true);
    setStep(4); // Move to loading screen

    try {
      const res = await fetch("/api/valuate", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      // Ensure the mock loading takes at least 2.5s for dramatic effect
      setTimeout(() => {
        setResult(data);
        setStep(5);
        setLoading(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      toast.error("Procjena nije uspjela. Pokušajte ponovno.");
      setLoading(false);
      setStep(3); // Revert on error
    }
  };

  const stepVariants: Variants = {
    hidden: { opacity: 0, x: 40, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      x: -40,
      filter: "blur(4px)",
      transition: { duration: 0.25, ease: "easeIn" as const },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto font-inter relative z-20">
      {/* Progress Header */}
      {step < 4 && (
        <div className="mb-10 px-2 text-center">
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--df-gold))] to-trust shadow-[0_0_8px_rgba(212,175,55,0.3)]"
              initial={{ width: "33.33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <div className="flex items-center justify-center text-xs text-slate-500 uppercase tracking-widest gap-2">
            <Lock className="size-3" />
            Vaši podaci su 100% povjerljivi — Korak {step} od 3
          </div>
        </div>
      )}

      <GlowCard className="w-full bg-card/80 backdrop-blur-2xl border border-white/[0.06] shadow-glass relative overflow-hidden rounded-[2rem]">
        <div className="pt-10 px-8 sm:px-12 relative z-10 min-h-100 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* STEP 1: INDUSTRY */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8 pb-10"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-heading font-extrabold text-navy dark:text-white tracking-tight">
                    Koja je primarna djelatnost vaše tvrtke?
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Algoritam koristi specifične tržišne multiplikatore po
                    sektorima.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {INDUSTRIES.map((ind) => (
                    <div
                      key={ind.id}
                      onClick={() =>
                        setFormData({ ...formData, industry: ind.id })
                      }
                      className={`cursor-pointer border p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 ${formData.industry === ind.id ? "border-trust bg-trust/10 shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-trust" : "border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03]"}`}
                    >
                      <ind.icon
                        className={`size-8 ${formData.industry === ind.id ? "text-blue-400" : "text-slate-500"}`}
                      />
                      <span
                        className={`text-sm font-semibold text-center ${formData.industry === ind.id ? "text-blue-400" : "text-slate-300"}`}
                      >
                        {ind.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: FINANCIALS */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8 pb-10"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-heading font-extrabold text-navy dark:text-white tracking-tight">
                    Financijski pokazatelji
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Unesite podatke za posljednjih 12 mjeseci poslovanja.
                  </p>
                </div>

                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="space-y-2 group">
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Godišnji Prihodi
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                        €
                      </span>
                      <Input
                        type="number"
                        value={formData.revenue === 0 ? "" : formData.revenue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            revenue: Number(e.target.value),
                          })
                        }
                        className="h-14 pl-10 text-lg bg-white/50 dark:bg-[#111A30]/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-df-trust-blue/50 transition-all"
                        placeholder="npr. 1000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center justify-between">
                      EBITDA (Operativna Dobit)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                        €
                      </span>
                      <Input
                        type="number"
                        value={formData.ebitda === 0 ? "" : formData.ebitda}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ebitda: Number(e.target.value),
                          })
                        }
                        className="h-14 pl-10 text-lg bg-white/50 dark:bg-[#111A30]/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-df-trust-blue/50 transition-all"
                        placeholder="npr. 250000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex flex-col">
                      SDE{" "}
                      <span className="text-[10px] font-normal text-slate-500 normal-case mt-0.5">
                        Zarada vlasnika (Neto dobit + vaša plaća + vaši osobni
                        troškovi unutar tvrtke)
                      </span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                        €
                      </span>
                      <Input
                        type="number"
                        value={formData.sde === 0 ? "" : formData.sde}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sde: Number(e.target.value),
                          })
                        }
                        className="h-14 pl-10 text-lg bg-white/50 dark:bg-[#111A30]/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-df-trust-blue/50 transition-all"
                        placeholder="npr. 300000"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: QUALITATIVE */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10 pb-10"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-heading font-extrabold text-navy dark:text-white tracking-tight">
                    Kvalitativni faktori
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Ovi suptilni faktori značajno utječu na konačni prodajni
                    multiplikator tvrtke.
                  </p>
                </div>

                <div className="space-y-12 max-w-xl mx-auto pt-4">
                  <div className="space-y-6 bg-slate-50/50 dark:bg-white/5 p-6 rounded-2xl">
                    <Label className="text-base font-bold text-slate-900 dark:text-white">
                      Ovisnost poslovanja o vama (vlasniku)
                    </Label>
                    <Slider
                      defaultValue={[formData.dependency]}
                      max={5}
                      min={1}
                      step={1}
                      onValueChange={(val: number | readonly number[]) =>
                        setFormData({
                          ...formData,
                          dependency: typeof val === "number" ? val : val[0],
                        })
                      }
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2">
                      <span
                        className={
                          formData.dependency === 1 ? "text-df-trust-blue" : ""
                        }
                      >
                        1 - Nimalo
                      </span>
                      <span
                        className={
                          formData.dependency === 5 ? "text-amber-500" : ""
                        }
                      >
                        5 - Potpuno
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      Posluje li tvrtka glatko mjesec dana dok ste vi na odmoru
                      bez pristupa emailu?
                    </p>
                  </div>

                  <div className="space-y-6 bg-slate-50/50 dark:bg-white/5 p-6 rounded-2xl">
                    <Label className="text-base font-bold text-slate-900 dark:text-white">
                      Uređenost i automatizacija procesa
                    </Label>
                    <Slider
                      defaultValue={[formData.maturity]}
                      max={5}
                      min={1}
                      step={1}
                      onValueChange={(val: number | readonly number[]) =>
                        setFormData({
                          ...formData,
                          maturity: typeof val === "number" ? val : val[0],
                        })
                      }
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2">
                      <span
                        className={
                          formData.maturity === 1 ? "text-red-500" : ""
                        }
                      >
                        1 - Kaos
                      </span>
                      <span
                        className={
                          formData.maturity === 5 ? "text-green-500" : ""
                        }
                      >
                        5 - Vrhunska
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      Imate li implementiran ERP, procedure za nove djelatnike i
                      strukturirane financije?
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: LOADING / GENERATING */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="py-20 flex flex-col items-center justify-center text-center"
              >
                <div className="relative size-32 mb-8">
                  {/* Outer pulse */}
                  <motion.div
                    animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute inset-0 rounded-full bg-df-trust-blue/20"
                  />
                  {/* Inner spinning ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border-4 border-t-df-trust-blue border-r-df-trust-blue/30 border-b-df-trust-blue/10 border-l-transparent"
                  />
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0B1120] rounded-full z-10 m-2">
                    <Sparkles className="size-8 text-gold animate-pulse" />
                  </div>
                </div>

                <h3 className="text-2xl font-heading font-extrabold text-navy dark:text-white mb-3">
                  Sintetiziranje DealFlow Podataka
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
                  Naš AI model trenutno uspoređuje vaše pokazatelje s povijesnim
                  M&A transakcijama u sektoru.
                </p>

                <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-trust to-blue-400 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)] transition-all duration-75"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="mt-3 text-sm font-mono text-blue-400 font-bold">
                  {loadingProgress}%
                </div>
              </motion.div>
            )}

            {/* STEP 5: RESULT */}
            {step === 5 && result && (
              <motion.div
                key="step5"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10 pb-6 w-full"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-5">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h2 className="text-3xl font-heading font-extrabold text-navy dark:text-white tracking-tight">
                    Vaša Inicijalna Procjena
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Ovo je algoritamski izračun baziran na unesenim podacima.
                  </p>
                </div>

                <div className="bg-linear-to-br from-slate-50 to-white dark:from-[#0B1120] dark:to-[#111A30] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 text-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-df-trust-blue to-transparent opacity-50" />

                  <h3 className="font-jakarta text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                    Procijenjena Tržišna Vrijednost
                  </h3>

                  <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-navy to-slate-600 dark:from-white dark:to-slate-300 font-heading tracking-tighter mb-2 drop-shadow-sm">
                    €{result.ranges.sde[0].toLocaleString("hr-HR")}{" "}
                    <span className="text-3xl text-slate-400 mx-2 font-normal">
                      do
                    </span>{" "}
                    €{result.ranges.ebitda[1].toLocaleString("hr-HR")}
                  </div>

                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-4">
                    Generirano pomoću DealFlow AI
                  </p>
                </div>

                <div
                  className="prose dark:prose-invert prose-slate max-w-none text-slate-600 dark:text-slate-300 font-inter text-left prose-headings:font-heading prose-headings:text-navy dark:prose-headings:text-white leading-relaxed p-6 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5"
                  dangerouslySetInnerHTML={{ __html: result.html }}
                />

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
                  <Link href="/dashboard/seller" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-df-navy hover:bg-df-navy/90 dark:bg-white dark:text-df-navy dark:hover:bg-slate-200 font-heading font-bold rounded-xl px-10 h-14 text-base shadow-[0_8px_30px_rgba(10,25,47,0.2)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1 group">
                      Započni Prodajni Proces
                      <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto font-heading rounded-xl px-6 h-14 text-slate-500 hover:text-navy dark:hover:text-white"
                  >
                    Ponovi izračun
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {step < 4 && (
          <div className="flex justify-between items-center p-6 sm:px-12 border-t border-white/[0.06] bg-white/[0.02] relative z-10">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1}
              className={`font-heading font-bold rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors h-12 px-6 ${step === 1 ? "invisible" : ""}`}
            >
              <ArrowLeft className="mr-2 size-4" /> Natrag
            </Button>

            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={step === 1 && !formData.industry}
                className="bg-df-trust-blue hover:bg-blue-700 text-white font-heading font-bold rounded-xl shadow-lg hover:shadow-[0_8px_25px_rgba(37,99,235,0.3)] transition-all h-12 px-8 group"
              >
                Sljedeće{" "}
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-gold hover:bg-yellow-500 text-white font-heading font-bold rounded-xl shadow-lg hover:shadow-[0_8px_25px_rgba(212,175,55,0.3)] transition-all h-12 px-8 group"
              >
                Generiraj Analizu{" "}
                <Sparkles className="ml-2 size-4 group-hover:scale-110 transition-transform" />
              </Button>
            )}
          </div>
        )}
      </GlowCard>
    </div>
  );
}
