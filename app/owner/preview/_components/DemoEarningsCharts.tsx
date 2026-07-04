'use client';

/**
 * Two small chart cards shown side-by-side on the preview home:
 *   - Earnings: a compact line chart over 4 checkpoints
 *   - Earnings / Services: a compact bar chart over 4 services
 *
 * Both palettes stay inside the Corporate Trust system (blue #2563EB for
 * the line, green #10B981 for the bars) and lean on `recharts` (already
 * a project dep — same library used by components/owner/RevenueChart).
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    earnings: 'Earnings',
    earningsByService: 'Earnings / Services',
  },
  es: {
    earnings: 'Ingresos',
    earningsByService: 'Ingresos por servicio',
  },
  pt: {
    earnings: 'Receitas',
    earningsByService: 'Receitas por serviço',
  },
} as const;

const LINE_DATA = [
  { label: 'Nov', value: 820 },
  { label: 'Mar', value: 1120 },
  { label: 'Jun', value: 980 },
  { label: 'Alex', value: 1450 },
];

const BAR_DATA = [
  { label: 'Mar', value: 420 },
  { label: 'Jun', value: 620 },
  { label: 'Jab', value: 380 },
  { label: 'Muni', value: 540 },
];

const CARD =
  'rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04),_0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-4';

export function DemoEarningsCharts() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);

  return (
    <section className="grid grid-cols-2 gap-2 sm:gap-3">
      <div className={CARD}>
        <p className="font-display text-[13px] font-semibold text-slate-900">
          {t.earnings}
        </p>
        <div className="mt-2 h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={LINE_DATA}
              margin={{ top: 6, right: 6, bottom: 0, left: -28 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#64748B' }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ stroke: '#2563EB', strokeOpacity: 0.15 }}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 11,
                  padding: '4px 8px',
                }}
                formatter={(v) => [`$${v}`, t.earnings]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 2.5, stroke: '#2563EB', fill: '#fff', strokeWidth: 1.5 }}
                activeDot={{ r: 3.5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={CARD}>
        <p className="font-display text-[13px] font-semibold text-slate-900">
          {t.earningsByService}
        </p>
        <div className="mt-2 h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={BAR_DATA}
              margin={{ top: 6, right: 6, bottom: 0, left: -28 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#E2E8F0"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#64748B' }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: 'rgba(16, 185, 129, 0.08)' }}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  fontSize: 11,
                  padding: '4px 8px',
                }}
                formatter={(v) => [`$${v}`, t.earningsByService]}
              />
              <Bar
                dataKey="value"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
