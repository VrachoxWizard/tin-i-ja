export default function SellerDashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 w-full py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-9 w-72 bg-white/[0.06] rounded-lg skeleton-shimmer" />
          </div>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[120px] bg-white/[0.03] border border-white/[0.06] rounded-2xl skeleton-shimmer"
              />
            ))}
          </div>
          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-[380px] bg-white/[0.03] border border-white/[0.06] rounded-2xl skeleton-shimmer" />
            </div>
            <div>
              <div className="h-[360px] bg-white/[0.03] border border-white/[0.06] rounded-2xl skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
