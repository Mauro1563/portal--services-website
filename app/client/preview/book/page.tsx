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
  HelpCircle,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { pickCopy, useClientLocale, type ClientLocale } from '@/lib/use-locale-client';
import { LONDON_PROPERTIES, MOCK_CTX, MOCK_SERVICES, PREVIEW_TOKEN } from '../_mock';

const COPY = {
  en: {
    pageTitle: 'Book a cleaning',
    loading: 'Loading…',
    errorDate: 'Choose a date',
    errorAddress: 'Add an address',
    successHeading: 'Your booking has been created!',
    successSub: 'We will confirm by email in a few minutes.',
    successService: 'Service:',
    successWhen: 'When:',
    successWhere: 'Where:',
    successNotes: 'Notes:',
    confirmationSent: 'Confirmation sent to sofia@example.com',
    viewMyBookings: 'See my bookings',
    viewMyBookingsTitle: 'See all your bookings',
    bookAnother: 'Make another booking',
    bookAnotherTitle: 'Create another booking',
    serviceHeading: 'Service',
    serviceHelpAria: 'Pick the type of clean you need',
    serviceHelpTitle: 'Pick the type of clean you need',
    bookOption: (name: string) => `Book a ${name.toLowerCase()}`,
    whenHeading: 'Date and time',
    dateLabel: 'Date',
    dateTitle: 'Pick the day of the clean',
    timeLabel: 'Time',
    timeTitle: 'Pick the approximate start time',
    addressLabel: 'Address',
    addressPlaceholder: 'e.g. 22 Old Compton St, Soho, London W1D 4TR',
    addressTitle: 'Enter the address of the clean',
    notesLabel: 'Notes (optional)',
    notesPlaceholder: 'For example: please give the kitchen a thorough going-over…',
    notesTitle: 'Add any useful detail for the cleaner',
    submit: 'Confirm booking',
    submitTitle: 'Send the booking to the team',
    footnote: 'Your team will confirm by chat in minutes.',
  },
  es: {
    pageTitle: 'Reservar limpieza',
    loading: 'Cargando…',
    errorDate: 'Elige una fecha',
    errorAddress: 'Indica una dirección',
    successHeading: '¡Tu reserva fue creada!',
    successSub: 'Te lo confirmamos por email en unos minutos.',
    successService: 'Servicio:',
    successWhen: 'Cuándo:',
    successWhere: 'Dónde:',
    successNotes: 'Notas:',
    confirmationSent: 'Confirmación enviada a sofia@example.com',
    viewMyBookings: 'Ver mis reservas',
    viewMyBookingsTitle: 'Ver todas tus reservas',
    bookAnother: 'Hacer otra reserva',
    bookAnotherTitle: 'Crear otra reserva',
    serviceHeading: 'Servicio',
    serviceHelpAria: 'Elige qué tipo de limpieza necesitas',
    serviceHelpTitle: 'Elige qué tipo de limpieza necesitas',
    bookOption: (name: string) => `Reservar una ${name.toLowerCase()}`,
    whenHeading: 'Fecha y hora',
    dateLabel: 'Fecha',
    dateTitle: 'Elige el día de la limpieza',
    timeLabel: 'Hora',
    timeTitle: 'Elige la hora aproximada de inicio',
    addressLabel: 'Dirección',
    addressPlaceholder: 'e.g. 22 Old Compton St, Soho, London W1D 4TR',
    addressTitle: 'Indica la dirección de la limpieza',
    notesLabel: 'Notas (opcional)',
    notesPlaceholder: 'Por ejemplo: revisar bien la cocina…',
    notesTitle: 'Añade cualquier detalle útil para el cleaner',
    submit: 'Confirmar reserva',
    submitTitle: 'Enviar la reserva al equipo',
    footnote: 'Tu equipo confirmará por chat en minutos.',
  },
  pt: {
    pageTitle: 'Reservar limpeza',
    loading: 'A carregar…',
    errorDate: 'Escolha uma data',
    errorAddress: 'Indique uma morada',
    successHeading: 'A sua reserva foi criada!',
    successSub: 'Confirmamos por email dentro de minutos.',
    successService: 'Serviço:',
    successWhen: 'Quando:',
    successWhere: 'Onde:',
    successNotes: 'Notas:',
    confirmationSent: 'Confirmação enviada para sofia@example.com',
    viewMyBookings: 'Ver as minhas reservas',
    viewMyBookingsTitle: 'Ver todas as suas reservas',
    bookAnother: 'Fazer outra reserva',
    bookAnotherTitle: 'Criar outra reserva',
    serviceHeading: 'Serviço',
    serviceHelpAria: 'Escolha o tipo de limpeza de que precisa',
    serviceHelpTitle: 'Escolha o tipo de limpeza de que precisa',
    bookOption: (name: string) => `Reservar uma ${name.toLowerCase()}`,
    whenHeading: 'Data e hora',
    dateLabel: 'Data',
    dateTitle: 'Escolha o dia da limpeza',
    timeLabel: 'Hora',
    timeTitle: 'Escolha a hora aproximada de início',
    addressLabel: 'Morada',
    addressPlaceholder: 'ex. 22 Old Compton St, Soho, London W1D 4TR',
    addressTitle: 'Indique a morada da limpeza',
    notesLabel: 'Notas (opcional)',
    notesPlaceholder: 'Por exemplo: rever bem a cozinha…',
    notesTitle: 'Adicione qualquer detalhe útil para a limpadora',
    submit: 'Confirmar reserva',
    submitTitle: 'Enviar a reserva à equipa',
    footnote: 'A sua equipa confirma por chat em minutos.',
  },
} as const satisfies Record<ClientLocale, unknown>;

type Errors = Partial<Record<'date' | 'address', string>>;

function BookForm() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
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
    if (!date.trim()) next.date = t.errorDate;
    if (!address.trim()) next.address = t.errorAddress;
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
        <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 motion-safe:[animation:bookingSuccessIn_0.45s_ease-out_both]">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <style>{`@keyframes bookingSuccessIn {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }`}</style>
        <h2 className="font-display text-lg font-bold text-slate-900">
          {t.successHeading}
        </h2>
        <p className="text-[13px] text-slate-600">
          {t.successSub}
        </p>
        <div className="w-full rounded-2xl bg-slate-50 p-3 text-left text-[12px] text-slate-700">
          <p>
            <span className="font-bold">{t.successService}</span> {svcName}
          </p>
          <p>
            <span className="font-bold">{t.successWhen}</span> {date} · {time}
          </p>
          <p>
            <span className="font-bold">{t.successWhere}</span> {address}
          </p>
          {notes && (
            <p>
              <span className="font-bold">{t.successNotes}</span> {notes}
            </p>
          )}
          <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700">
            <Mail className="h-3 w-3" /> {t.confirmationSent}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Link
            href="/client/preview/cleanings"
            title={t.viewMyBookingsTitle}
            className="flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-4 text-[12px] font-bold uppercase tracking-wider text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.6)] hover:bg-blue-700"
          >
            {t.viewMyBookings}
          </Link>
          <button
            type="button"
            onClick={resetForm}
            title={t.bookAnotherTitle}
            className="rounded-full bg-slate-100 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-200"
          >
            {t.bookAnother}
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
            {t.serviceHeading}
          </h2>
          <button
            type="button"
            aria-label={t.serviceHelpAria}
            title={t.serviceHelpTitle}
            className="grid h-8 w-8 -m-2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {MOCK_SERVICES.map((s) => (
            <li key={s.id}>
              <label
                className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-slate-100 transition hover:ring-blue-200 has-[:checked]:bg-blue-50/60 has-[:checked]:ring-blue-300"
                title={t.bookOption(s.name)}
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
          {t.whenHeading}
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[12px] font-semibold text-slate-700">
              {t.dateLabel}
            </span>
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              title={t.dateTitle}
              aria-invalid={errors.date ? true : undefined}
              aria-describedby={errors.date ? 'book-date-error' : undefined}
              className={`mt-1 block h-11 w-full rounded-2xl border bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.date ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.date && (
              <p
                id="book-date-error"
                role="alert"
                className="mt-1 text-[12px] font-medium text-rose-700"
              >
                {errors.date}
              </p>
            )}
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold text-slate-700">
              {t.timeLabel}
            </span>
            <input
              type="time"
              name="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              title={t.timeTitle}
              className="mt-1 block h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        </div>
      </section>

      <section>
        <label className="block">
          <span className="flex items-center gap-1 text-[12px] font-semibold text-slate-700">
            <MapPin className="h-3 w-3" /> {t.addressLabel}
          </span>
          <input
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t.addressPlaceholder}
            title={t.addressTitle}
            aria-invalid={errors.address ? true : undefined}
            aria-describedby={errors.address ? 'book-address-error' : undefined}
            className={`mt-1 block h-11 w-full rounded-2xl border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              errors.address ? 'border-rose-400' : 'border-slate-200'
            }`}
          />
          {errors.address && (
            <p
              id="book-address-error"
              role="alert"
              className="mt-1 text-[12px] font-medium text-rose-700"
            >
              {errors.address}
            </p>
          )}
        </label>
      </section>

      <section>
        <label className="block">
          <span className="text-[12px] font-semibold text-slate-700">
            {t.notesLabel}
          </span>
          <textarea
            name="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.notesPlaceholder}
            title={t.notesTitle}
            className="mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </label>
      </section>

      <button
        type="submit"
        title={t.submitTitle}
        className="flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)] transition hover:bg-blue-700"
      >
        {t.submit}
      </button>

      <p className="text-center text-[11px] text-slate-400">
        {t.footnote}
      </p>
    </form>
  );
}

function BookFormFallback() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  return <p className="text-sm text-slate-500">{t.loading}</p>;
}

function BookShell({ children }: { children: React.ReactNode }) {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="reservas"
      title={t.pageTitle}
      showBack
      backHref="/client/preview"
    >
      {children}
    </ClientShell>
  );
}

export default function ClientBookPreview() {
  return (
    <BookShell>
      <Suspense fallback={<BookFormFallback />}>
        <BookForm />
      </Suspense>
    </BookShell>
  );
}
