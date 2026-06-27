import Link from 'next/link';
import { ChevronRight, KeyRound, PlayCircle } from 'lucide-react';
import { PortalLoginCard, LoginField } from '@/components/portal/PortalLoginCard';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { signIn } from '@/app/login/actions';

type Props = {
  searchParams: Promise<{ error?: string; pin?: string }>;
};

export default async function OperativeLogin({ searchParams }: Props) {
  const { error, pin } = await searchParams;

  // Pre-fill from the deep-link the owner shares via WhatsApp/SMS so the
  // cleaner only needs to tap "Enter" instead of typing six digits. We
  // validate against the same shape the field's `pattern` enforces (4–8
  // digits) to keep garbage out of the input. The signIn action will still
  // reject anything that isn't a valid PIN, so this is just UX, not auth.
  const prefillPin = pin && /^\d{4,8}$/.test(pin) ? pin : '';

  return (
    <PortalLoginCard
      badges={['Operative Portal']}
      title="Ingresa con tu PIN"
      subtitle="Tu manager te dio un PIN de 6 dígitos."
      error={error ? decodeURIComponent(error) : undefined}
    >
      <div>
        {/* PRIMARY CTA — the demo escape hatch. Anyone landing here from the
            marketing site has no real cleaner PIN, so the no-auth demo must
            be the unmistakable primary action above the fold. */}
        <Link
          href="/operative/preview"
          title="Entra al demo del operario sin necesidad de PIN"
          className="group flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-3 text-left shadow-[0_14px_30px_-12px_rgba(5,150,105,0.55)] transition hover:from-emerald-400 hover:to-teal-500"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <PlayCircle className="h-5 w-5" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[15px] font-bold leading-tight text-white">
              Probar el demo
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-emerald-50">
              Entra como cleaner sin código
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        {/* Divider — funnels real-PIN cleaners to the demoted form below. */}
        <div className="my-5 flex items-center gap-3">
          <hr className="flex-1 border-t border-slate-200" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            ¿Eres cleaner con PIN real?
          </span>
          <hr className="flex-1 border-t border-slate-200" />
        </div>

        <form action={signIn} className="space-y-3">
          <LoginField label="PIN">
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="identifier"
                required
                inputMode="numeric"
                pattern="[0-9]{4,8}"
                autoComplete="one-time-code"
                defaultValue={prefillPin}
                placeholder="Tu PIN de 6 dígitos"
                className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-3 text-center font-mono text-base tracking-[0.35em] text-[#0b1d3a] placeholder:font-normal placeholder:text-[12px] placeholder:tracking-normal placeholder:text-slate-400 transition focus:border-[#0b1d3a] focus:outline-none focus:ring-4 focus:ring-[#0b1d3a]/10"
              />
            </div>
          </LoginField>

          {/* Password input is required by /login's signIn action shape but
              unused for PIN auth — submit empty. */}
          <input type="hidden" name="password" value="" />

          <SubmitButton
            pendingLabel="Entrando…"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-slate-100 active:translate-y-px disabled:opacity-70"
          >
            Entrar con PIN
            <ChevronRight className="h-4 w-4" />
          </SubmitButton>
        </form>
      </div>
    </PortalLoginCard>
  );
}
