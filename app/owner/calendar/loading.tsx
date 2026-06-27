/**
 * Skeleton for /owner/calendar. Calendar grid is the heaviest widget
 * here — it pulls tasks for the visible month with joins, then groups
 * by day. The skeleton just shows an empty month grid to anchor layout.
 */
export default function CalendarLoading() {
  return (
    <main className="min-h-screen bg-surface-1 pb-20">
      <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-5">
        <div className="space-y-2">
          <Bar w="w-32" />
          <Bar w="w-48" h="h-6" />
        </div>

        {/* Month nav */}
        <div className="mt-4 flex items-center justify-between">
          <Bar w="w-32" h="h-6" />
          <div className="flex gap-2">
            <Bar w="w-8" h="h-8" />
            <Bar w="w-8" h="h-8" />
          </div>
        </div>

        {/* Day-of-week row */}
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Bar key={i} w="w-full" h="h-4" />
          ))}
        </div>

        {/* 6×7 calendar grid */}
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 42 }, (_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg bg-slate-200/60"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function Bar({ w, h = 'h-3' }: { w: string; h?: string }) {
  return (
    <div className={`${h} ${w} animate-pulse rounded-md bg-slate-200/70`} />
  );
}
