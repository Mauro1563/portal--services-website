import {
  Activity,
  Building2,
  CheckCircle2,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

/**
 * Stylised representation of the HQ dashboard for marketing-page hero
 * mockups. Not a real screenshot — every number and pixel is original
 * design work mocked in pure markup.
 */
export function HQDashboardMockup() {
  const stats = [
    { label: 'Edificios', value: '47', delta: '+4', Icon: Building2 },
    { label: 'Operativos', value: '312', delta: '+18', Icon: Users },
    { label: 'Calidad', value: '4.8', delta: '+0.2', Icon: Star },
    { label: 'Uptime', value: '99.9%', delta: '', Icon: Activity },
  ];

  const activity = [
    { who: 'María R.', what: 'Check-in · Edificio Atlas', when: '2m', tone: 'emerald' },
    { who: 'Carlos M.', what: 'Inspección · 4.9/5', when: '5m', tone: 'cyan' },
    { who: 'Lucía V.', what: 'Parte diario enviado', when: '11m', tone: 'violet' },
    { who: 'Pedro K.', what: 'Suministros aprobados', when: '18m', tone: 'amber' },
  ] as const;

  const toneCls: Record<string, string> = {
    emerald: 'bg-emerald-400',
    cyan: 'bg-cyan-400',
    violet: 'bg-violet-400',
    amber: 'bg-amber-400',
  };

  return (
    <div className="grid gap-4 bg-ink-1 p-5 text-white">
      {/* Top KPI row */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(({ label, value, delta, Icon }) => (
          <div
            key={label}
            className="rounded-xl bg-white/[0.04] p-3 ring-1 ring-inset ring-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
              </span>
              <Icon className="h-3 w-3 text-cyan-300" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-xl font-bold tabular-nums">
                {value}
              </span>
              {delta ? (
                <span className="text-[9px] font-semibold text-emerald-300">
                  {delta}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Chart + activity */}
      <div className="grid grid-cols-5 gap-3">
        {/* Chart card */}
        <div className="col-span-3 rounded-xl bg-white/[0.04] p-4 ring-1 ring-inset ring-white/[0.06]">
          <div className="flex items-center justify-between">
            <p className="font-display text-xs font-semibold">Calidad — 30 días</p>
            <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[9px] font-semibold text-cyan-300">
              + 6.2%
            </span>
          </div>
          {/* Pretend area chart */}
          <svg viewBox="0 0 300 100" className="mt-3 h-24 w-full">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3DC5F0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3DC5F0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,80 L30,70 L60,75 L90,55 L120,60 L150,40 L180,45 L210,30 L240,32 L270,18 L300,22 L300,100 L0,100 Z"
              fill="url(#g)"
            />
            <path
              d="M0,80 L30,70 L60,75 L90,55 L120,60 L150,40 L180,45 L210,30 L240,32 L270,18 L300,22"
              fill="none"
              stroke="#3DC5F0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Activity feed */}
        <div className="col-span-2 rounded-xl bg-white/[0.04] p-4 ring-1 ring-inset ring-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-cyan-300" />
            <p className="font-display text-xs font-semibold">Actividad</p>
          </div>
          <ul className="mt-2.5 space-y-2">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${toneCls[a.tone]}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-medium">
                    {a.who}
                  </p>
                  <p className="truncate text-[9px] text-slate-400">{a.what}</p>
                </div>
                <span className="shrink-0 text-[9px] text-slate-500">
                  {a.when}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Building list */}
      <div className="rounded-xl bg-white/[0.04] p-4 ring-1 ring-inset ring-white/[0.06]">
        <p className="font-display text-xs font-semibold">Edificios activos</p>
        <ul className="mt-2.5 divide-y divide-white/[0.04]">
          {[
            { name: 'Atlas Tower · Mayfair', score: '4.9', state: 'En turno' },
            { name: 'Riverside Coworking', score: '4.7', state: 'En turno' },
            { name: 'Hospital Westwood', score: '4.8', state: 'Inspección' },
          ].map((b) => (
            <li
              key={b.name}
              className="flex items-center justify-between py-1.5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-emerald-300" />
                <span className="text-[10px]">{b.name}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-slate-400">
                <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-amber-300">
                  ★ {b.score}
                </span>
                <span>{b.state}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
