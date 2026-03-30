import { TeaserCardSkeleton } from "@/components/features/TeaserCardSkeleton";

export default function ListingsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="relative bg-background border-b border-white/10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="h-12 w-80 bg-white/[0.06] rounded-lg skeleton-shimmer mb-4" />
          <div className="h-6 w-[500px] max-w-full bg-white/[0.04] rounded-lg skeleton-shimmer mb-10" />
          <div className="h-16 w-full bg-white/[0.03] border border-white/10 skeleton-shimmer" />
        </div>
      </div>
      <main className="flex-1 w-full py-12 -mt-6">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-72 shrink-0">
            <div className="h-[400px] bg-white/[0.03] border border-white/10 skeleton-shimmer" />
          </aside>
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <TeaserCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
