export default function ListingDetailLoading() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <section className="relative bg-background border-b border-border pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="h-4 w-40 bg-muted rounded skeleton-shimmer mb-8" />
          <div className="flex gap-3 mb-4">
            <div className="h-6 w-28 bg-muted rounded-none skeleton-shimmer" />
            <div className="h-6 w-24 bg-muted rounded-none skeleton-shimmer" />
          </div>
          <div className="h-10 w-80 bg-muted rounded skeleton-shimmer mb-2" />
          <div className="h-5 w-48 bg-muted/70 rounded skeleton-shimmer" />
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="border border-border p-6">
                <div className="h-6 w-48 bg-muted rounded skeleton-shimmer mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 bg-muted/60 border border-border rounded-none skeleton-shimmer"
                    />
                  ))}
                </div>
              </div>
              <div className="border border-border p-6">
                <div className="h-6 w-32 bg-muted rounded skeleton-shimmer mb-6" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-muted/70 rounded skeleton-shimmer" />
                  <div className="h-4 w-5/6 bg-muted/70 rounded skeleton-shimmer" />
                  <div className="h-4 w-4/6 bg-muted/70 rounded skeleton-shimmer" />
                  <div className="h-4 w-full bg-muted/70 rounded skeleton-shimmer" />
                  <div className="h-4 w-3/4 bg-muted/70 rounded skeleton-shimmer" />
                </div>
              </div>
            </div>
            <div>
              <div className="h-[280px] bg-muted/60 border border-border rounded-none skeleton-shimmer" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
