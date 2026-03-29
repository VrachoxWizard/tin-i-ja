import { SectionShell } from "@/components/shared/SectionShell";
import { trustPoints } from "@/data/homepage";

export function TrustSection() {
  return (
    <SectionShell spacing="default">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-sans mb-4">
          Naš pristup
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-5 tracking-tight">
          Zašto DealFlow?
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Transparentnost, preciznost i sigurnost — temelji na kojima gradimo
          povjerenje.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {trustPoints.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:border-white/[0.12] transition-colors duration-300"
          >
            <div className="size-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
              <Icon className="size-5 text-slate-400" aria-hidden="true" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-white mb-3 tracking-tight">
              {title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
