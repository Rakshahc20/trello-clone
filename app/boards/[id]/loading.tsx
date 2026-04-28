export default function Loading() {
  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Header */}
        <div className="mb-6 h-16 rounded-2xl bg-muted" />

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-border bg-card"
            />
          ))}
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="mb-4 h-6 w-28 rounded bg-muted" />

              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-24 rounded-2xl bg-muted"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}