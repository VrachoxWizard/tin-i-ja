export default function DealRoomLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 w-full py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back link */}
          <div className="h-4 w-44 bg-white/[0.06] rounded skeleton-shimmer mb-6" />
          {/* Badges */}
          <div className="flex gap-3 mb-4">
            <div className="h-6 w-28 bg-emerald-500/10 rounded-none skeleton-shimmer" />
            <div className="h-6 w-24 bg-white/[0.06] rounded-none skeleton-shimmer" />
          </div>
          {/* Title */}
          <div className="h-10 w-48 bg-white/[0.06] rounded skeleton-shimmer mb-2" />
          <div className="h-5 w-64 bg-white/[0.04] rounded skeleton-shimmer mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Financial card */}
              <div className="border border-white/10 p-6">
                <div className="h-5 w-40 bg-white/[0.06] rounded skeleton-shimmer mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-white/[0.03] border border-white/[0.06] rounded-none skeleton-shimmer"
                    />
                  ))}
                </div>
              </div>
              {/* Teaser card */}
              <div className="border border-white/10 p-6">
                <div className="h-5 w-56 bg-white/[0.06] rounded skeleton-shimmer mb-6" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-white/[0.04] rounded skeleton-shimmer" />
                  <div className="h-4 w-5/6 bg-white/[0.04] rounded skeleton-shimmer" />
                  <div className="h-4 w-4/6 bg-white/[0.04] rounded skeleton-shimmer" />
                </div>
              </div>
              {/* Documents card */}
              <div className="border border-white/10 p-6">
                <div className="h-5 w-32 bg-white/[0.06] rounded skeleton-shimmer mb-6" />
                <div className="h-32 bg-white/[0.02] border border-dashed border-white/10 rounded-none skeleton-shimmer" />
              </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="h-[260px] bg-white/[0.03] border border-white/10 rounded-none skeleton-shimmer" />
              <div className="h-[160px] bg-white/[0.03] border border-white/10 rounded-none skeleton-shimmer" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
