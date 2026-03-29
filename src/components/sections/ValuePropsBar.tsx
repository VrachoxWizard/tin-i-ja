import { valueProps } from "@/data/homepage";

export function ValuePropsBar() {
  return (
    <section className="relative z-30 -mt-12 mx-4 md:mx-auto max-w-5xl">
      <div className="relative py-8 md:py-10 bg-slate-900/60 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
        {/* Top edge highlight */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />

        <div className="flex flex-wrap justify-evenly items-center relative z-10 px-6 md:px-12 gap-y-6">
          {valueProps.map(({ icon: Icon, label, desc }, i) => (
            <div key={label} className="flex items-center gap-y-6">
              {i > 0 && (
                <div className="hidden md:block w-px h-10 bg-white/[0.08] mx-6" />
              )}
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <Icon
                    className="size-4.5 text-slate-400"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <div className="text-sm font-heading font-semibold text-white">
                    {label}
                  </div>
                  <div className="text-xs text-slate-500">{desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
