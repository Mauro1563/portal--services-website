/**
 * Public preview: Client → Profile (read-only). Mocked Sofía data.
 */
import { Gift, Mail, MapPin, Phone, User } from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

export const metadata = {
  title: 'Vista previa · Perfil',
  robots: { index: false, follow: false },
};

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-inset ring-slate-100">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-[13.5px] font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ClientProfilePreview() {
  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="profile"
      title="Mi perfil"
    >
      <section className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white shadow-[0_10px_24px_-12px_rgba(37,99,235,0.6)]">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/15 text-xl font-bold backdrop-blur">
            S
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold">Sofía Martín</p>
            <p className="mt-0.5 text-[12px] text-blue-100">
              Cliente desde 2024
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-[13px] font-bold text-slate-900">Datos</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          <Field icon={Mail} label="Email" value="sofia@example.com" />
          <Field icon={Phone} label="Teléfono" value="+34 612 345 678" />
          <Field
            icon={MapPin}
            label="Dirección"
            value="C/ Mayor 24, 3ºB, Madrid"
          />
          <Field icon={Gift} label="Código de referido" value="PREVIEW" />
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-100">
        <p className="text-[11px] text-slate-500">
          ¿Necesitas actualizar tus datos? Escríbele a{' '}
          <span className="font-semibold text-slate-900">Limpiezas Premium</span>{' '}
          desde el chat y lo cambiamos al instante.
        </p>
      </section>
    </ClientShell>
  );
}
