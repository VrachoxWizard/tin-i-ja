import { SectionShell } from "@/components/shared/SectionShell";
import { trustPoints } from "@/data/homepage";

export function TrustSection() {
  return (
    <SectionShell spacing="none" className="py-24 md:py-40 bg-[#02040A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm tracking-[0.2em] text-gold font-semibold uppercase mb-8 flex items-center justify-center gap-4">
          <span className="w-8 h-px bg-gold" />
          Naš pristup
          <span className="w-8 h-px bg-gold" />
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading text-white mb-24 tracking-tight leading-[1.05]">
          Zašto DealFlow?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 max-w-6xl mx-auto md:divide-x divide-white/5">
          {trustPoints.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`flex flex-col items-center md:px-8`}
            >
              <div className="mb-10 p-5 rounded-full bg-[#050A15] border border-white/5">
                <Icon className="size-6 text-gold/80" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-medium text-white mb-6">
                {title}
              </h3>
              <p className="text-slate-400 font-light leading-relaxed max-w-sm mx-auto">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
