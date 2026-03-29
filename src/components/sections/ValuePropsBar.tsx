import { valueProps } from "@/data/homepage";

export function ValuePropsBar() {
  return (
    <section className="relative z-30 -mt-16 mx-4 md:mx-auto max-w-6xl">
      <div className="relative py-12 bg-card border border-white/5 shadow-2xl">
        <div className="flex flex-wrap justify-evenly items-center relative z-10 px-6 md:px-12 gap-y-8">
          {valueProps.map(({ icon: Icon, label, desc }, i) => (
            <div key={label} className="flex items-center gap-y-6">
              {i > 0 && (
                <div className="hidden md:block w-px h-12 bg-white/5 mx-6 lg:mx-10" />
              )}
              <div className="flex items-start gap-5">
                <div className="mt-0.5">
                  <Icon
                    className="size-5 text-primary"
                    aria-hidden="true"
                    strokeWidth={1}
                  />
                </div>
                <div>
                  <div className="text-sm font-heading font-medium tracking-[0.15em] text-foreground uppercase mb-2">
                    {label}
                  </div>
                  <div className="text-xs font-light text-muted-foreground tracking-wide max-w-[200px]">
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
