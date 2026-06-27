/**
 * Public preview: Client → Book a cleaning. Fully interactive in the
 * demo — useState-backed form fields, inline validation, animated
 * success state on submit. No backend; refreshing resets the demo.
 */
'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { LONDON_PROPERTIES, MOCK_CTX, MOCK_SERVICES, PREVIEW_TOKEN } from '../_mock';

type Errors = Partial<Record<'date' | 'address', string>>;

function BookForm() {
  const params = useSearchParams();
  const preselectedService = params.get('service');

  const [service, setService] = useState<string>(
    preselectedService && MOCK_SERVICES.some((s) => s.id === preselectedService)
      ? preselectedService
      : MOCK_SERVICES[0].id,
  );
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('10:00');
  const [address, setAddress] = useState<string>(LONDON_PROPERTIES.soho.address);
  const [notes, setNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  // Keep the selected service in sync if the user lands here from the
  // service catalog sheet (which sets ?service=… in the URL).
  useEffect(() => {
    if (preselectedService && MOCK_SERVICES.some((s) => s.id === preselectedService)) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!date.trim()) next.date = 'Elige una fecha';
    if (!address.trim()) next.address = 'Indica una dirección';
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  function resetForm() {
    setService(MOCK_SERVICES[0].id);
    setDate('');
    setTime('10:00');
    setAddress(LONDON_PROPERTIES.soho.address);
    setNotes('');
    setSubmitted(false);
    setErrors({});
  }

  if (submitted) {
    const svcName = MOCK_SERVICES.find((s) => s.id === service)?.name ?? '';
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center ring-1 ring-inset ring-emerald-100">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8 animate-pulse" />
        </span>
        <h2 className="font-display text-lg font-bold text-slate-900">
          ¡Tu reserva fue creada!
        </h2>
        <p className="text-[13px] text-slate-600">
          Te lo confirmamos por email en unos minutos.
        </p>
        <div className="w-full rounded-2xl bg-slate-50 p-3 text-left text-[12px] text-slate-700">
          <p>
            <span className="font-bold">Servicio:</span> {svcName}
          </p>
          <p>
            <span className="font-bold">Cuándo:</span> {date} · {time}
          </p>
          <p>
            <span className="font-bold">Dónde:</span> {address}
          </p>
          {notes && (
            <p>
              <span className="font-bold">Notas:</span> {notes}
            </p>
          )}
          <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700">
            <Mail className="h-3 w-3" /> Confirmación enviada a sofia@example.com
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Link
            href="/client/preview/cleanings"
            title="Ver todas tus reservas"
            className="flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-4 text-[12px] font-bold uppercase tracking-wider text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.6)] hover:bg-blue-700"
          >
            Ver mis reservas
          </Link>
          <button
            type="button"
            onClick={resetForm}
            title="Crear otra reserva"
            className="rounded-full bg-slate-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
          >
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Servicio
          </h2>
          <span
            className="text-[10px] text-slate-400"
            title="Elige qué tipo de limpieza necesitas"
          >
            ?
          </span>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {MOCK_SERVICES.map((s) => (
            <li key={s.id}>
              <label
                className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-slate-100 transition hover:ring-blue-200 has-[:checked]:bg-blue-50/60 has-[:checked]:ring-blue-300"
                title={`Reservar una ${s.name.toLowerCase()}`}
              >
                <input
                  type="radio"
                  name="service"
                  value={s.id}
                  checked={service === s.id}
                  onChange={() => setService(s.id)}
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
              title="Elige el día de la limpieza"
              className={`mt-1 block h-11 w-full rounded-2xl border bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.date ? 'border-rose-300' : 'border-slate-200'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-[10.5px] text-rose-600">{errors.date}</p>
            )}
          </label>
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Hora
            </span>
            <input
              type="time"
              name="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              title="Elige la hora aproximada de inicio"
              className="mt-1 block h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        </div>
      </section>

      <section>
        <label className="block">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <MapPin className="h-3 w-3" /> Dirección
          </span>
          <input
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 22 Old Compton St, Soho, London W1D 4TR"
            title="Indica la dirección de la limpieza"
            className={`mt-1 block h-11 w-full rounded-2xl border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              errors.address ? 'border-rose-300' : 'border-slate-200'
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-[10.5px] text-rose-600">{errors.address}</p>
          )}
        </label>
      </section>

      <section>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Notas (opcional)
          </span>
          <textarea
            name="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Por ejemplo: revisar bien la cocina…"
            title="Añade cualquier detalle útil para el cleaner"
            className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </section>

      <button
        type="submit"
        title="Enviar la reserva al equipo"
        className="flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] transition hover:bg-blue-700"
      >
        Confirmar reserva
      </button>

      <p className="text-center text-[11px] text-slate-400">
        Tu equipo confirmará por chat en minutos.
      </p>
    </form>
  );
}

export default function ClientBookPreview() {
  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="reservas"
      title="Reservar limpieza"
      showBack
      backHref="/client/preview"
    >
      <Suspense fallback={<p className="text-sm text-slate-500">Cargando…</p>}>
        <BookForm />
      </Suspense>
    </ClientShell>
  );
}
