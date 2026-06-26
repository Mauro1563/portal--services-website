import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CalendarPlus,
  CheckCircle2,
  Circle,
  KeyRound,
  Sparkles,
  UserPlus,
} from 'lucide-react';

type Step = {
  done: boolean;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  cta: string;
  href: string;
};

/**
 * "Get started" checklist for owners who haven't finished the basics yet.
 * Renders nothing once every step is done — its only purpose is to help
 * a new account stop staring at the dashboard wondering what to do next.
 *
 * Logic is intentionally simple: we just check counts the dashboard
 * already has. No persistence — the user doesn't need to "dismiss" it;
 * it disappears automatically when the work is real.
 */
export function OnboardingChecklist({
  propertiesCount,
  cleanersCount,
  clientsCount,
  tasksTotal,
}: {
  propertiesCount: number;
  cleanersCount: number;
  clientsCount: number;
  tasksTotal: number;
}) {
  const steps: Step[] = [
    {
      done: propertiesCount > 0,
      icon: Building2,
      title: 'Agregá tu primera propiedad',
      description:
        'Una casa, un piso, un Airbnb… cualquier lugar donde se limpie.',
      cta: 'Sumar propiedad',
      href: '/owner/properties/new',
    },
    {
      done: cleanersCount > 0,
      icon: KeyRound,
      title: 'Sumá tu primer limpiador',
      description:
        'Le generamos un PIN; entra a su portal con ese número, sin email.',
      cta: 'Agregar limpiador',
      href: '/owner/cleaners/new',
    },
    {
      done: clientsCount > 0,
      icon: UserPlus,
      title: 'Cargá tu primer cliente',
      description:
        'Cada cliente recibe un link mágico para ver y valorar las limpiezas.',
      cta: 'Crear cliente',
      href: '/owner/clients/new',
    },
    {
      done: tasksTotal > 0,
      icon: CalendarPlus,
      title: 'Programá la primera limpieza',
      description:
        'Asigná propiedad, fecha y limpiador. Ya estás operativo.',
      cta: 'Programar',
      href: '/owner/tasks/new',
    },
  ];

  const done = steps.filter((s) => s.done).length;
  const total = steps.length;

  if (done === total) return null;

  return (
    <section className="rounded-2xl border border-brand-600/30 bg-gradient-to-br from-brand-600/[0.04] to-brand-600/[0.01] p-5 shadow-card">
      <header className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 text-brand-700">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-semibold text-text-1">
            Listo para arrancar
          </h2>
          <p className="mt-0.5 text-[12px] text-text-2">
            {done} de {total} configurados. Termina lo que falta para tener tu
            operación funcionando.
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <ul className="mt-4 space-y-2">
        {steps.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className={`group flex items-center gap-3 rounded-xl border p-3 transition ${
                s.done
                  ? 'border-surface-2 bg-surface-0/60 opacity-70'
                  : 'border-surface-2 bg-surface-0 hover:border-brand-600/40 hover:shadow-card'
              }`}
            >
              {s.done ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-text-3" />
              )}
              <div className="min-w-0 flex-1">
                <p
                  className={`font-display text-sm font-semibold ${
                    s.done ? 'text-text-3 line-through' : 'text-text-1'
                  }`}
                >
                  {s.title}
                </p>
                {!s.done && (
                  <p className="mt-0.5 text-[11px] text-text-2">
                    {s.description}
                  </p>
                )}
              </div>
              {!s.done && (
                <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-brand-700 transition group-hover:gap-1.5">
                  {s.cta}
                  <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
