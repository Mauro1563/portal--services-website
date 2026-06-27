/**
 * Public preview: Client → Cleanings list. Mocked reservas (upcoming
 * + past). No auth, no Supabase.
 */
import Link from 'next/link';
import { CalendarCheck, CheckCircle2, Clock } from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

export const metadata = {
  title: 'Vista previa · Reservas',
  robots: { index: false, follow: false },
};

type Status = 'upcoming' | 'done';

type Reserva = {
  id: string;
  service: string;
  cleaner: string;
  when: string;
  duration: string;
  status: Status;
};

const RESERVAS: Reserva[] = [
  {
    id: 'r1',
    service: 'Limpieza estándar',
    cleaner: 'Ana Ruiz',
    when: 'Mañana · 10:00',
    duration: '~2 h',
    status: 'upcoming',
  },
  {
    id: 'r2',
    service: 'Cristales',
    cleaner: 'Luis Pérez',
    when: 'Vie 5 jul · 12:30',
    duration: '~1 h',
    status: 'upcoming',
  },
  {
    id: 'r3',
    service: 'Limpieza profunda',
    cleaner: 'Ana Ruiz',
    when: 'Sáb 14 jun · 09:00',
    duration: '~4 h',
    status: 'done',
  },
  {
    id: 'r4',
    service: 'Limpieza estándar',
    cleaner: 'Ana Ruiz',
    when: 'Mié 4 jun · 10:00',
    duration: '~2 h',
    status: 'done',
  },
  {
    id: 'r5',
    service: 'Mudanza',
    cleaner: 'Luis Pérez',
    when: 'Lun 12 may · 08:00',
    duration: '~5 h',
    status: 'done',
  },
];

function ReservaCard({ r }: { r: Reserva }) {
  const isUpcoming = r.status === 'upcoming';
  return (
    <li>
      <div className="rounded-3xl bg-white p-4 ring-1 ring-inset ring-slate-100">
        <div className="flex items-start gap-3">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
              isUpcoming
                ? 'bg-blue-50 text-blue-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {isUpcoming ? (
              <CalendarCheck className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                isUpcoming ? 'text-blue-700' : 'text-slate-400'
              }`}
            >
              {r.when}
            </p>
            <p className="mt-0.5 font-display text-sm font-bold text-slate-900">
              {r.service}
            </p>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Con {r.cleaner} · {r.duration}
            </p>
          </div>
          <span
            className={`shrink-0 self-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              isUpcoming
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isUpcoming ? 'Próxima' : 'Hecha'}
          </span>
        </div>
      </div>
    </li>
  );
}

export default function ClientCleaningsPreview() {
  const upcoming = RESERVAS.filter((r) => r.status === 'upcoming');
  const done = RESERVAS.filter((r) => r.status === 'done');

  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="reservas"
      title="Reservas"
    >
      <section>
        <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
          <Clock className="h-3.5 w-3.5 text-blue-600" />
          Próximas
        </h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {upcoming.map((r) => (
            <ReservaCard key={r.id} r={r} />
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Hechas
        </h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {done.map((r) => (
            <ReservaCard key={r.id} r={r} />
          ))}
        </ul>
      </section>

      <Link
        href={`/client/${PREVIEW_TOKEN}/book`}
        className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] transition hover:bg-blue-700"
      >
        Reservar nueva limpieza
      </Link>
    </ClientShell>
  );
}
