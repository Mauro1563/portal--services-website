/**
 * Skeleton for /owner/properties. Property cards with a thumbnail,
 * name, address line and a chevron.
 */
export default function PropertiesLoading() {
  return (
    <main className="min-h-screen bg-surface-1 pb-20">
      <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-4 sm:py-5">
        <div className="space-y-2">
          <Bar w="w-24" />
          <Bar w="w-40" h="h-6" />
        </div>

        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-surface-2 bg-surface-0 px-4 py-3"
            >
              <span className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-slate-200/70" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Bar w="w-3/4" />
                <Bar w="w-1/2" />
              </div>
              <Bar w="w-4" h="h-4" />
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
