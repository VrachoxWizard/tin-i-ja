import { valueProps } from "@/data/homepage";

export function ValuePropsBar() {
  return (
    <section className="relative z-30 -mt-16 mx-4 md:mx-auto max-w-6xl">
      <div className="relative py-10 bg-background/95 backdrop-blur-xl border border-white/10 rounded-sm shadow-2xl">
        <div className="flex flex-wrap justify-evenly items-center relative z-10 px-6 md:px-12 gap-y-8">
          {valueProps.map(({ icon: Icon, label, desc }, i) => (
            <div key={label} className="flex items-center gap-y-6">
              {i > 0 && (
                <div className="hidden md:block w-px h-12 bg-white/10 mx-6 lg:mx-10" />
              )}
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Icon
                    className="size-5 text-gold"
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <div className="text-base font-heading font-medium tracking-wide text-white mb-1">
                    {label}
                  </div>
                  <div className="text-sm font-light text-slate-400">
                    {desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
