/**
 * Public preview: Client → Book a cleaning. Static form, no submit
 * handler — the button is decorative in the demo.
 */
import { Calendar, Sparkles } from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { MOCK_CTX, MOCK_SERVICES, PREVIEW_TOKEN } from '../_mock';

export const metadata = {
  title: 'Vista previa · Reservar',
  robots: { index: false, follow: false },
};

export default function ClientBookPreview() {
  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="reservas"
      title="Reservar limpieza"
      showBack
      backHref={`/client/${PREVIEW_TOKEN}`}
    >
      <form action="#" className="flex flex-col gap-5">
        <section>
          <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Servicio
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {MOCK_SERVICES.map((s, i) => (
              <li key={s.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-slate-100 transition hover:ring-blue-200 has-[:checked]:bg-blue-50/60 has-[:checked]:ring-blue-300">
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    defaultChecked={i === 0}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-[13.5px] font-semibold text-slate-900">
                    {s.name}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            Fecha y hora
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Fecha
              </span>
              <input
                type="date"
                name="date"
                className="mt-1 block h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Hora
              </span>
              <input
                type="time"
                name="time"
                defaultValue="10:00"
                className="mt-1 block h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>
        </section>

        <section>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Notas (opcional)
            </span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Por ejemplo: revisar bien la cocina…"
              className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        </section>

        <button
          type="submit"
          className="flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] transition hover:bg-blue-700"
        >
          Pedir limpieza
        </button>

        <p className="text-center text-[11px] text-slate-400">
          Tu equipo confirmará por chat en minutos.
        </p>
      </form>
    </ClientShell>
  );
}
