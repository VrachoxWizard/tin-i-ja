export default function AdminDashboardLoading() {
    return (
        <div className="flex-1 py-10 px-4 md:px-8 animate-pulse">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header skeleton */}
                <div className="h-8 w-48 bg-muted rounded-none" />

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="border border-border bg-card p-5 space-y-3">
                            <div className="h-3 w-20 bg-muted rounded-none" />
                            <div className="h-8 w-16 bg-muted rounded-none" />
                        </div>
                    ))}
                </div>

                {/* Table skeleton */}
                <div className="border border-border bg-card">
                    <div className="p-5 border-b border-border">
                        <div className="h-4 w-32 bg-muted rounded-none" />
                    </div>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-b-0"
                        >
                            <div className="h-4 w-4 bg-muted rounded-full shrink-0" />
                            <div className="h-4 flex-1 bg-muted rounded-none" />
                            <div className="h-4 w-24 bg-muted rounded-none" />
                            <div className="h-6 w-16 bg-muted rounded-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
