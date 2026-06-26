import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { BottomTabBar } from '@/components/operative/BottomTabBar';
import { waUrl } from '@/lib/phone';

export const dynamic = 'force-dynamic';

/**
 * Cleaner support page — surfaces the manager/owner's contact details
 * plus a few quick-help links. Resolves the owner via the cleaner's
 * `owner_id` and pulls business name from owner_profiles + login email
 * from auth.users (the only contact channels we reliably have today).
 */
export default async function OperativeSupport() {
  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) redirect('/operative/login');

  const admin = createAdminClient();
  const { data: cleaner } = await admin
    .from('cleaners')
    .select('id, owner_id')
    .eq('id', cleanerId)
    .maybeSingle();
  if (!cleaner) redirect('/operative/login');

  const [{ data: profile }, ownerAuth] = await Promise.all([
    admin
      .from('owner_profiles')
      .select('business_name')
      .eq('owner_id', cleaner.owner_id)
      .maybeSingle(),
    admin.auth.admin.getUserById(cleaner.owner_id),
  ]);

  const businessName = profile?.business_name ?? null;
  const email = ownerAuth.data?.user?.email ?? null;
  const phone =
    (ownerAuth.data?.user?.user_metadata?.phone as string | undefined) ??
    null;
  const owner = { business_name: businessName };
  const wa = waUrl(
    phone,
    'Hola, soy uno de tus cleaners y necesito ayuda con una tarea.',
  );

  return (
    <main className="min-h-screen bg-canvas pb-24">
      <div className="mx-auto max-w-md px-4 py-6">
        <header>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-3">
            Cleaner · Soporte
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-text-1">
            ¿Necesitas ayuda?
          </h1>
          <p className="mt-1 text-sm text-text-2">
            Contacta a tu manager o consulta las preguntas frecuentes.
          </p>
        </header>

        <section className="mt-5 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
            <Building2 className="h-3 w-3" /> Tu manager
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold text-text-1">
            {owner.business_name ?? 'Empresa'}
          </h2>

          {phone || email || wa ? (
            <ul className="mt-4 space-y-2">
              {wa ? (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 transition hover:bg-emerald-50"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-emerald-900">
                        WhatsApp
                      </p>
                      <p className="text-[11px] text-emerald-700/80">
                        Respuesta más rápida
                      </p>
                    </div>
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-3 rounded-xl border border-surface-2 bg-surface-0 p-3 transition hover:border-brand-400"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-1">Llamar</p>
                      <p className="text-[11px] text-text-3">{phone}</p>
                    </div>
                  </a>
                </li>
              ) : null}
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 rounded-xl border border-surface-2 bg-surface-0 p-3 transition hover:border-brand-400"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-700 text-white">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-1">Email</p>
                      <p className="truncate text-[11px] text-text-3">{email}</p>
                    </div>
                  </a>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-surface-2 px-3 py-3 text-[11px] text-text-3">
              Tu manager aún no ha configurado canales de soporte. Avísale
              para que añada un teléfono o WhatsApp.
            </p>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-surface-2 bg-surface-0 p-4 shadow-card">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-3">
            <HelpCircle className="h-3 w-3" /> Preguntas frecuentes
          </p>
          <ul className="mt-3 space-y-3 text-[13px] leading-relaxed text-text-1">
            <li>
              <p className="font-semibold">¿Cómo hago check-in?</p>
              <p className="mt-0.5 text-[12px] text-text-2">
                Abre la tarea y pulsa "Check in (GPS)". Necesitas dar permiso
                de ubicación una sola vez.
              </p>
            </li>
            <li>
              <p className="font-semibold">¿Cómo subo fotos al terminar?</p>
              <p className="mt-0.5 text-[12px] text-text-2">
                Dentro de la tarea en curso pulsa "Take photo", la cámara se
                abre directamente. Puedes subir varias antes de completar.
              </p>
            </li>
            <li>
              <p className="font-semibold">¿Y si no veo mis tareas?</p>
              <p className="mt-0.5 text-[12px] text-text-2">
                Sólo tu manager puede asignarte tareas. Si crees que falta
                alguna, contáctale por WhatsApp.
              </p>
            </li>
          </ul>
        </section>

        <p className="mt-6 text-center text-[10px] text-text-3">
          <Link href="/operative" className="hover:text-text-1">
            ← Volver a la agenda
          </Link>
        </p>
      </div>

      <BottomTabBar active="soporte" />
    </main>
  );
}
