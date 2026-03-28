"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'

export function ValuatorWizard() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ html: string; ranges: any } | null>(null)
  
  const [formData, setFormData] = useState({
    industry: "",
    revenue: 0,
    ebitda: 0,
    sde: 0,
    dependency: 3,
    maturity: 3,
  })

  const handleNext = () => setStep((s) => Math.min(s + 1, 5))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/valuate", {
        method: "POST",
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setResult(data)
      setStep(5)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <Progress value={(step / 5) * 100} className="h-2" />
        <div className="mt-2 text-sm text-muted-foreground text-center font-sans tracking-widest uppercase">
          KORAK {step} OD 5
        </div>
      </div>

      <Card className="w-full bg-card/50 backdrop-blur-md border-border/60 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(circle at 50% -20%, #1565C0 0%, transparent 50%)" }} />
        <CardContent className="pt-8 relative z-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <CardTitle className="text-2xl font-heading mb-6">Osnovni podaci i Sektor</CardTitle>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>U kojoj industriji poslujete?</Label>
                    <Select onValueChange={(val: string | null) => val && setFormData({ ...formData, industry: val })}>
                      <SelectTrigger className="w-full bg-background/50">
                        <SelectValue placeholder="Odaberite sektor..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT_Software">IT i Softver</SelectItem>
                        <SelectItem value="Turizam">Turizam i Ugostiteljstvo</SelectItem>
                        <SelectItem value="Trgovina">Trgovina i Webshop</SelectItem>
                        <SelectItem value="Proizvodnja">Proizvodnja</SelectItem>
                        <SelectItem value="Usluge">Usluge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <CardTitle className="text-2xl font-heading mb-6">Financijski Pregled</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Godišnji prihodi (EUR)</Label>
                    <Input type="number" onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>EBITDA (Dobit)</Label>
                    <Input type="number" onChange={(e) => setFormData({ ...formData, ebitda: Number(e.target.value) })} className="bg-background/50" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>SDE (Zarada Vlasnika)</Label>
                    <p className="text-xs text-muted-foreground mb-2">Neto dobit + plaća vlasnika + osobni troškovi</p>
                    <Input type="number" onChange={(e) => setFormData({ ...formData, sde: Number(e.target.value) })} className="bg-background/50" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                <CardTitle className="text-2xl font-heading mb-6">Kvalitativni Pokazatelji</CardTitle>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label>Ovisnost poslovanja o vama (1 = Nimalo, 5 = Potpuno)</Label>
                    <Slider defaultValue={[3]} max={5} min={1} step={1} onValueChange={(val: number | readonly number[]) => setFormData({ ...formData, dependency: typeof val === 'number' ? val : val[0] })} />
                    <div className="flex justify-between text-xs text-muted-foreground"><span>Nimalo</span><span>Potpuno</span></div>
                  </div>
                  <div className="space-y-4">
                    <Label>Digitalna zrelost procesa (1 = Papirnato, 5 = Automatizirano)</Label>
                    <Slider defaultValue={[3]} max={5} min={1} step={1} onValueChange={(val: number | readonly number[]) => setFormData({ ...formData, maturity: typeof val === 'number' ? val : val[0] })} />
                    <div className="flex justify-between text-xs text-muted-foreground"><span>Niska</span><span>Visoka</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 text-center py-8">
                <CardTitle className="text-2xl font-heading mb-4">Generiranje Izvještaja</CardTitle>
                <p className="text-muted-foreground mb-8">Pripremam poziv prema DealFlow AI valuacijskoj jezgri. Ovaj proces koristi financijske i operativne multiplikatore prilagođene hrvatskom tržištu.</p>
                <Button size="lg" onClick={handleSubmit} disabled={loading} className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 font-heading">
                  {loading ? "Analiziram podatke..." : "Pokaži Procjenu"}
                </Button>
              </motion.div>
            )}

            {step === 5 && result && (
              <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 text-center">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Informativni Raspon Vrijednosti</h3>
                  <div className="text-3xl font-bold text-accent font-sans">
                    €{result.ranges.sde[0].toLocaleString('hr-HR')} - €{result.ranges.ebitda[1].toLocaleString('hr-HR')}
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none text-muted-foreground font-sans text-left" dangerouslySetInnerHTML={{ __html: result.html }} />
                <div className="flex justify-center pt-6">
                  <Link href="/sell">
                    <Button className="bg-primary hover:bg-primary/90 font-heading rounded-full px-8">
                      Nastavi i Anonimiziraj Listing
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        {step < 4 && (
          <CardFooter className="flex justify-between pt-6 border-t border-border/50 relative z-10">
            <Button variant="outline" onClick={handlePrev} disabled={step === 1} className="font-heading">Natrag</Button>
            <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white font-heading">Sljedeće Korak</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
