export function TeaserCardSkeleton() {
  return (
    <div className="rounded-[2rem] bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-glass overflow-hidden animate-pulse">
      {/* Top gradient bar */}
      <div className="h-1.5 bg-linear-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />

      <div className="p-6 space-y-5">
        {/* Badge + Industry */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-slate-200/80 dark:bg-slate-700/80 rounded-full" />
          <div className="h-5 w-16 bg-slate-200/80 dark:bg-slate-700/80 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-slate-200/80 dark:bg-slate-700/80 rounded-lg" />
          <div className="h-6 w-1/2 bg-slate-200/60 dark:bg-slate-700/60 rounded-lg" />
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl" />
          <div className="h-20 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl" />
        </div>

        {/* Asking price */}
        <div className="h-8 w-40 bg-slate-200/80 dark:bg-slate-700/80 rounded-lg" />

        {/* Teaser text */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200/60 dark:bg-slate-700/60 rounded" />
          <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded" />
          <div className="h-4 w-2/3 bg-slate-200/40 dark:bg-slate-700/40 rounded" />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <div className="h-10 flex-1 bg-slate-200/80 dark:bg-slate-700/80 rounded-xl" />
          <div className="h-10 flex-1 bg-slate-200/60 dark:bg-slate-700/60 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
