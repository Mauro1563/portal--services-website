'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type RevenuePoint = {
  /** Short label shown under the bar, e.g. "L", "M", "X" or "26/06". */
  label: string;
  /** Raw revenue in pence. Converted to £ for display. */
  pence: number;
};

function fmtMoney(pence: number): string {
  return `£${(pence / 100).toFixed(0)}`;
}

/**
 * 7-day revenue bar chart in the Corporate Trust palette — solid blue
 * bars on a subtle grid. Tooltip shows the exact £ amount for the
 * hovered/tapped bar. Caller controls the date range and shape.
 */
export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const empty = data.every((d) => d.pence === 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
      <header className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Ingresos esta semana
          </h2>
          <p className="mt-0.5 text-[12.5px] text-slate-600">
            Últimos 7 días
          </p>
        </div>
        <p className="font-display text-lg font-bold tabular-nums text-[#10B981]">
          {fmtMoney(data.reduce((sum, d) => sum + d.pence, 0))}
        </p>
      </header>

      {empty ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
          <p className="px-6 text-[12.5px] text-slate-600">
            Sin ingresos aún. Cuando marques tareas como cobradas, aparecerá
            la tendencia aquí.
          </p>
        </div>
      ) : (
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid
                vertical={false}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748B' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                tickFormatter={(v: number) => fmtMoney(v)}
              />
              <Tooltip
                cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }}
                contentStyle={{
                  borderRadius: 10,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 14px -4px rgba(15,23,42,0.12)',
                  fontSize: 12,
                }}
                formatter={(value) => [fmtMoney(Number(value) || 0), 'Ingresos']}
              />
              <Bar
                dataKey="pence"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
