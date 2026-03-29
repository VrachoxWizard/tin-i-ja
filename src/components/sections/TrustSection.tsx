import { SectionShell } from "@/components/shared/SectionShell";
import { trustPoints } from "@/data/homepage";

export function TrustSection() {
  return (
    <SectionShell spacing="none" className="py-24 md:py-40 bg-background border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <p className="text-[0.7rem] tracking-[0.25em] text-primary font-medium uppercase mb-12 flex items-center justify-center gap-4">
          <span className="w-12 h-[1px] bg-primary/70" />
          Naš pristup
          <span className="w-12 h-[1px] bg-primary/70" />
        </p>
        <h2 className="text-5xl md:text-6xl lg:text-[7rem] font-heading text-foreground mb-32 tracking-tighter leading-[1.0] max-w-5xl mx-auto">
          Zašto <br className="md:hidden" /> <span className="italic text-muted-foreground font-light">DealFlow?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-0 max-w-6xl mx-auto md:divide-x divide-white/5">
          {trustPoints.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`flex flex-col items-center md:px-12 group`}
            >
              <div className="mb-10 text-muted-foreground group-hover:text-primary transition-colors duration-700">
                <Icon className="size-8 md:size-10" strokeWidth={1} />
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-6 tracking-tight">
                {title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-sm mx-auto tracking-wide">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
