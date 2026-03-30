export default function ListingDetailLoading() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Header skeleton */}
      <section className="relative bg-background border-b border-white/10 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="h-4 w-40 bg-white/[0.06] rounded skeleton-shimmer mb-8" />
          <div className="flex gap-3 mb-4">
            <div className="h-6 w-28 bg-white/[0.06] rounded-none skeleton-shimmer" />
            <div className="h-6 w-24 bg-white/[0.06] rounded-none skeleton-shimmer" />
          </div>
          <div className="h-10 w-80 bg-white/[0.06] rounded skeleton-shimmer mb-2" />
          <div className="h-5 w-48 bg-white/[0.04] rounded skeleton-shimmer" />
        </div>
      </section>

      {/* Content skeleton */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Financial cards */}
              <div className="border border-white/10 p-6">
                <div className="h-6 w-48 bg-white/[0.06] rounded skeleton-shimmer mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-24 bg-white/[0.03] border border-white/[0.06] rounded-none skeleton-shimmer"
                    />
                  ))}
                </div>
              </div>
              {/* Teaser content */}
              <div className="border border-white/10 p-6">
                <div className="h-6 w-32 bg-white/[0.06] rounded skeleton-shimmer mb-6" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-white/[0.04] rounded skeleton-shimmer" />
                  <div className="h-4 w-5/6 bg-white/[0.04] rounded skeleton-shimmer" />
                  <div className="h-4 w-4/6 bg-white/[0.04] rounded skeleton-shimmer" />
                  <div className="h-4 w-full bg-white/[0.04] rounded skeleton-shimmer" />
                  <div className="h-4 w-3/4 bg-white/[0.04] rounded skeleton-shimmer" />
                </div>
              </div>
            </div>
            {/* Sidebar */}
            <div>
              <div className="h-[280px] bg-white/[0.03] border border-white/10 rounded-none skeleton-shimmer" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
