import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Gift,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
} from 'lucide-react';
import { getClientByToken } from '@/lib/client-auth';
import { getUnreadOwnerMessageCount } from '@/lib/client-messages';
import { ClientShell } from '@/components/client/ClientShell';

/**
 * Read-only client profile — the data the owner has on file plus
 * shortcuts to Reviews and Refer. Editing isn't supported here yet
 * (owners manage client records); a "request change" CTA could be
 * wired through /messages later if needed.
 */
export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const ctx = await getClientByToken(token);
  if (!ctx) notFound();

  const unread = await getUnreadOwnerMessageCount(ctx.client.id);
  const firstName = ctx.client.name.split(/\s+/)[0] ?? ctx.client.name;
  const initials =
    ctx.client.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] ?? '')
      .join('')
      .toUpperCase() || '·';

  return (
    <ClientShell
      ctx={ctx}
      token={token}
      activeTab="profile"
      title="Mi perfil"
      unreadMessages={unread}
    >
      {/* Avatar card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-5 text-center text-white shadow-[0_18px_40px_-18px_rgba(5,150,105,0.55)]">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/20 text-2xl font-bold text-white ring-4 ring-white/15 backdrop-blur">
          {initials}
        </span>
        <h1 className="mt-3 font-display text-xl font-semibold">
          {ctx.client.name}
        </h1>
        <p className="mt-0.5 text-[12px] text-emerald-50/80">
          {ctx.owner.business_name ?? 'Tu equipo de limpieza'}
        </p>
      </section>

      {/* Contact details */}
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          Datos de contacto
        </p>
        <ul className="mt-3 space-y-3">
          <Field
            Icon={User}
            label="Nombre"
            value={ctx.client.name}
          />
          {ctx.client.phone ? (
            <Field
              Icon={Phone}
              label="Teléfono"
              value={ctx.client.phone}
            />
          ) : null}
          {ctx.client.email ? (
            <Field
              Icon={Mail}
              label="Email"
              value={ctx.client.email}
            />
          ) : null}
          {ctx.client.address ? (
            <Field
              Icon={MapPin}
              label="Dirección"
              value={ctx.client.address}
            />
          ) : null}
        </ul>

        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">
          ¿Algo cambió? Avísale a tu equipo desde{' '}
          <Link
            href={`/client/${token}/messages`}
            className="font-semibold text-emerald-700 hover:underline"
          >
            chat
          </Link>{' '}
          y lo actualizamos por ti.
        </p>
      </section>

      {/* Quick links */}
      <section className="mt-4 space-y-2">
        <QuickLink
          href={`/client/${token}/reviews`}
          Icon={Star}
          label="Mis valoraciones"
          sub="Lo que opinaste de cada visita"
        />
        <QuickLink
          href={`/client/${token}/refer`}
          Icon={Gift}
          label="Refer & Earn"
          sub={`Invita a un amigo y gana un premio · ${firstName}`}
        />
      </section>
    </ClientShell>
  );
}

function Field({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </li>
  );
}

function QuickLink({
  href,
  Icon,
  label,
  sub,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
    </Link>
  );
}
