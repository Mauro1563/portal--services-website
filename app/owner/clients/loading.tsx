/**
 * Skeleton for /owner/clients. Mirrors a list of client cards
 * (name, contact line, unread badge) while the query resolves.
 */
export default function ClientsLoading() {
  return (
    <main className="min-h-screen bg-surface-1 pb-20">
      <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-5">
        <div className="space-y-2">
          <Bar w="w-28" />
          <Bar w="w-40" h="h-6" />
        </div>

        {/* Search bar */}
        <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-slate-200/70" />

        <ul className="mt-4 space-y-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-surface-2 bg-surface-0 px-4 py-3"
            >
              <span className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-200/70" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Bar w="w-2/3" />
                <Bar w="w-1/2" />
              </div>
              <Bar w="w-8" h="h-6" />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function Bar({ w, h = 'h-3' }: { w: string; h?: string }) {
  return (
    <div className={`${h} ${w} animate-pulse rounded-md bg-slate-200/70`} />
  );
}
