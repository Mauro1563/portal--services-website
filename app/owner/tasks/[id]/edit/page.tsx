import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  MapPin,
  Save,
  Tag,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { LightLayout } from '@/components/owner/LightLayout';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { getT } from '@/lib/i18n';
import { ensureDefaultServices } from '@/lib/default-services';
import { getOwnerProfile } from '@/lib/owner-profile';
import { TaskRateOverrides } from '@/components/owner/TaskRateOverrides';
import { updateTask } from '../actions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

type TaskRow = {
  id: string;
  property_id: string | null;
  cleaner_id: string | null;
  client_id: string | null;
  service_type_id: string | null;
  scheduled_for: string;
  start_time: string | null;
  estimated_duration_min: number | null;
  price_pence: number | null;
  payment_status: string;
  payment_method: string | null;
  paid_amount_pence: number | null;
  notes: string | null;
  charge_rate_pence: number | null;
  cleaner_pay_rate_pence: number | null;
};

const inputCls =
  'mt-1.5 block h-11 w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 text-sm text-text-1 placeholder:text-text-3 transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/25';
const textareaCls =
  'mt-1.5 block w-full rounded-xl border border-surface-2 bg-surface-0 px-3.5 py-3 text-sm text-text-1 placeholder:text-text-3 transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/25';
const labelTitle = 'text-xs font-medium text-text-2';

export default async function EditTaskPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  await ensureDefaultServices(user.id);

  const [
    { data: taskData },
    { data: propertiesData },
    { data: cleanersData },
    { data: clientsData },
    { data: servicesData },
    ownerProfile,
  ] = await Promise.all([
    supabase
      .from('tasks')
      .select(
        'id, property_id, cleaner_id, client_id, service_type_id, scheduled_for, start_time, estimated_duration_min, price_pence, payment_status, payment_method, paid_amount_pence, notes, charge_rate_pence, cleaner_pay_rate_pence',
      )
      .eq('id', id)
      .eq('owner_id', user.id)
      .maybeSingle(),
    supabase
      .from('properties')
      .select('id, name, default_charge_rate_pence')
      .order('name'),
    supabase
      .from('cleaners')
      .select('id, name, default_hourly_pay_pence')
      .order('name'),
    supabase.from('clients').select('id, name').order('name'),
    supabase
      .from('service_types')
      .select('id, name, price_pence, hourly_rate_pence, default_duration_min')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    getOwnerProfile(user.id),
  ]);

  const task = taskData as TaskRow | null;
  if (!task) notFound();

  const properties = propertiesData ?? [];
  const cleaners = cleanersData ?? [];
  const clients = clientsData ?? [];
  const services = servicesData ?? [];

  const durationHours =
    task.estimated_duration_min != null
      ? (task.estimated_duration_min / 60).toString()
      : '';
  const price =
    task.price_pence != null ? (task.price_pence / 100).toFixed(2) : '';
  const paidAmount =
    task.paid_amount_pence != null
      ? (task.paid_amount_pence / 100).toFixed(2)
      : '';

  return (
    <LightLayout
      activeTab="tasks"
      title="Editar tarea"
      showBack
      backHref={`/owner/tasks/${task.id}`}
    >
      {error ? (
        <p className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <form action={updateTask} className="space-y-5 pb-28">
        <input type="hidden" name="task_id" value={task.id} />

        <SectionCard
          accent="cyan"
          icon={MapPin}
          title={t('taskNew.whoWhereTitle')}
          desc={t('taskNew.whoWhereDesc')}
        >
          <label className="block">
            <span className={labelTitle}>
              {t('taskNew.fieldProperty')}
              <span className="ml-0.5 text-rose-500">*</span>
            </span>
            <select
              name="property_id"
              required
              defaultValue={task.property_id ?? ''}
              className={inputCls}
            >
              <option value="">{t('tasks.pickProperty')}…</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelTitle}>
                {t('taskNew.fieldCleaner') + ' (' + t('taskNew.optional') + ')'}
              </span>
              <select
                name="cleaner_id"
                defaultValue={task.cleaner_id ?? ''}
                className={inputCls}
              >
                <option value="">{t('taskNew.cleanerUnassigned')}</option>
                {cleaners.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelTitle}>{t('taskNew.fieldClient')}</span>
              <select
                name="client_id"
                defaultValue={task.client_id ?? ''}
                className={inputCls}
              >
                <option value="">{t('taskNew.clientNone')}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </SectionCard>

        <SectionCard
          accent="violet"
          icon={CalendarClock}
          title={t('taskNew.whenTitle')}
          desc={t('taskNew.whenDesc')}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelTitle}>
                {t('taskNew.fieldDate')}
                <span className="ml-0.5 text-rose-500">*</span>
              </span>
              <input
                type="date"
                name="scheduled_for"
                required
                defaultValue={task.scheduled_for?.slice(0, 10)}
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className={labelTitle}>{t('taskNew.fieldStartTime')}</span>
              <input
                type="time"
                name="start_time"
                defaultValue={task.start_time ?? ''}
                className={inputCls}
              />
            </label>
          </div>

          <label className="block">
            <span className={labelTitle}>{t('taskNew.fieldDuration')}</span>
            <input
              type="number"
              name="estimated_duration_hours"
              min="0.25"
              step="0.25"
              placeholder="1.5"
              defaultValue={durationHours}
              className={inputCls}
            />
          </label>
        </SectionCard>

        <SectionCard
          accent="emerald"
          icon={Tag}
          title={t('taskNew.serviceTitle')}
          desc={t('taskNew.serviceDesc')}
        >
          <label className="block">
            <span className={labelTitle}>{t('taskNew.serviceField')}</span>
            <select
              name="service_type_id"
              defaultValue={task.service_type_id ?? ''}
              className={inputCls}
            >
              <option value="">{t('taskNew.noService')}</option>
              {services.map((s) => {
                const p = s.price_pence
                  ? `£${(s.price_pence / 100).toFixed(2)}`
                  : s.hourly_rate_pence
                  ? `£${(s.hourly_rate_pence / 100).toFixed(2)}/h`
                  : '';
                return (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {p ? ` — ${p}` : ''}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="block">
            <span className={labelTitle}>{t('taskNew.priceField')}</span>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-text-3">
                £
              </span>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={price}
                className={`${inputCls} mt-0 pl-7`}
              />
            </div>
          </label>
        </SectionCard>

        <SectionCard
          accent="emerald"
          icon={Tag}
          title="Tarifas (opcional)"
          desc="Se autocompletan desde la propiedad y el cleaner — podés sobreescribirlas solo para esta tarea."
        >
          <TaskRateOverrides
            properties={properties.map((p) => ({
              id: p.id,
              default_charge_rate_pence:
                (p as { default_charge_rate_pence?: number | null }).default_charge_rate_pence ?? 0,
            }))}
            cleaners={cleaners.map((c) => ({
              id: c.id,
              default_hourly_pay_pence:
                (c as { default_hourly_pay_pence?: number | null }).default_hourly_pay_pence ?? 0,
            }))}
            initialChargePence={task.charge_rate_pence}
            initialPayPence={task.cleaner_pay_rate_pence}
            initialPropertyId={task.property_id}
            initialCleanerId={task.cleaner_id}
            ownerDefaultChargePence={ownerProfile.default_charge_rate_pence}
          />
        </SectionCard>

        <SectionCard
          accent="amber"
          icon={CreditCard}
          title={t('taskNew.paymentTitle')}
          desc={t('taskNew.paymentDesc')}
        >
          <label className="block">
            <span className={labelTitle}>{t('taskNew.paymentStatus')}</span>
            <select
              name="payment_status"
              defaultValue={task.payment_status}
              className={inputCls}
            >
              <option value="pending">⏳ {t('taskNew.payPending')}</option>
              <option value="paid">✅ {t('taskNew.payPaid')}</option>
              <option value="partial">⚖️ {t('taskNew.payPartial')}</option>
              <option value="waived">🆓 {t('taskNew.payWaived')}</option>
            </select>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={labelTitle}>{t('taskNew.payMethod')}</span>
              <select
                name="payment_method"
                defaultValue={task.payment_method ?? ''}
                className={inputCls}
              >
                <option value="">—</option>
                <option value="cash">💵 {t('taskNew.mCash')}</option>
                <option value="card">💳 {t('taskNew.mCard')}</option>
                <option value="transfer">🏦 {t('taskNew.mTransfer')}</option>
                <option value="bacs">📮 {t('taskNew.mBacs')}</option>
                <option value="apple_pay">🍎 {t('taskNew.mApplePay')}</option>
                <option value="google_pay">🔵 {t('taskNew.mGooglePay')}</option>
                <option value="other">📋 {t('taskNew.mOther')}</option>
              </select>
            </label>

            <label className="block">
              <span className={labelTitle}>{t('taskNew.payAmount')}</span>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-text-3">
                  £
                </span>
                <input
                  type="number"
                  name="paid_amount"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  defaultValue={paidAmount}
                  className={`${inputCls} mt-0 pl-7`}
                />
              </div>
            </label>
          </div>
        </SectionCard>

        <SectionCard accent="slate" icon={ArrowLeft} title={t('taskNew.notesTitle')} hideIcon>
          <label className="block">
            <span className={labelTitle}>{t('taskNew.notesField')}</span>
            <textarea
              name="notes"
              rows={3}
              defaultValue={task.notes ?? ''}
              placeholder={t('taskNew.notesPlaceholder')}
              className={textareaCls}
            />
          </label>
        </SectionCard>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-surface-2 bg-surface-0/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <Link
              href={`/owner/tasks/${task.id}`}
              className="flex h-12 shrink-0 items-center justify-center rounded-2xl border border-surface-2 bg-surface-0 px-4 text-sm font-medium text-text-2 hover:bg-surface-1"
            >
              {t('common.cancel')}
            </Link>
            <SubmitButton
              pendingLabel="Guardando…"
              className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.55)] transition hover:brightness-110 disabled:opacity-80"
            >
              <Save className="h-4 w-4" />
              Guardar cambios
            </SubmitButton>
          </div>
        </div>
      </form>
    </LightLayout>
  );
}

const accentMap = {
  cyan: { stripe: 'from-cyan-400 to-blue-500', icon: 'bg-cyan-50 text-cyan-600 ring-cyan-200' },
  violet: { stripe: 'from-violet-400 to-fuchsia-500', icon: 'bg-violet-50 text-violet-600 ring-violet-200' },
  emerald: { stripe: 'from-emerald-400 to-teal-500', icon: 'bg-emerald-50 text-emerald-600 ring-emerald-200' },
  amber: { stripe: 'from-amber-400 to-orange-500', icon: 'bg-amber-50 text-amber-600 ring-amber-200' },
  slate: { stripe: 'from-slate-300 to-slate-400', icon: 'bg-slate-100 text-slate-500 ring-slate-200' },
} as const;
type Accent = keyof typeof accentMap;

function SectionCard({
  accent,
  icon: Icon,
  title,
  desc,
  hideIcon,
  children,
}: {
  accent: Accent;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc?: string;
  hideIcon?: boolean;
  children: React.ReactNode;
}) {
  const a = accentMap[accent];
  return (
    <section className="relative overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
      <div className={`h-1 bg-gradient-to-r ${a.stripe}`} />
      <div className="p-5">
        <header className="mb-5 flex items-start gap-3">
          {hideIcon ? null : (
            <span
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${a.icon}`}
            >
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base font-semibold text-text-1">
              {title}
            </h2>
            {desc ? <p className="mt-0.5 text-xs text-text-3">{desc}</p> : null}
          </div>
        </header>
        <div className="space-y-4">{children}</div>
      </div>
    </section>
  );
}
