export function TeaserCardSkeleton() {
  return (
    <div className="rounded-[2rem] bg-card/80 border border-white/[0.06] shadow-glass backdrop-blur-xl overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1 bg-linear-to-r from-trust/20 via-[hsl(var(--df-gold))]/20 to-trust/20" />

      <div className="p-6 space-y-5">
        {/* Badge + Industry */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-white/[0.06] rounded-full skeleton-shimmer" />
          <div className="h-5 w-16 bg-white/[0.06] rounded-full skeleton-shimmer" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-white/[0.06] rounded-lg skeleton-shimmer" />
          <div className="h-6 w-1/2 bg-white/[0.04] rounded-lg skeleton-shimmer" />
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 bg-white/[0.03] border border-white/[0.06] rounded-xl skeleton-shimmer" />
          <div className="h-20 bg-white/[0.03] border border-white/[0.06] rounded-xl skeleton-shimmer" />
        </div>

        {/* Asking price */}
        <div className="h-8 w-40 bg-white/[0.06] rounded-lg skeleton-shimmer" />

        {/* Teaser text */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/[0.04] rounded skeleton-shimmer" />
          <div className="h-4 w-full bg-white/[0.03] rounded skeleton-shimmer" />
          <div className="h-4 w-2/3 bg-white/[0.03] rounded skeleton-shimmer" />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <div className="h-11 flex-1 bg-white/[0.04] rounded-xl skeleton-shimmer" />
          <div className="h-11 flex-1 bg-white/[0.04] rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
