import { ValuatorWizard } from "@/components/features/ValuatorWizard"

export default function ValuatePage() {
  return (
    <div className="flex-1 w-full flex items-center justify-center py-12 px-4 bg-background">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Saznajte vrijednost svoje tvrtke u minutama.
          </h1>
          <p className="text-muted-foreground text-lg font-sans">
            Anonimno, brzo i podržano najnovijom M&A analitikom za hrvatsko tržište.
          </p>
        </div>
        <ValuatorWizard />
      </div>
    </div>
  )
}
