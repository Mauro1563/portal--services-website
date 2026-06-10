import { ChevronRight, KeyRound } from 'lucide-react';
import { PortalLoginCard, LoginField } from '@/components/portal/PortalLoginCard';
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
      <form action={signIn} className="space-y-4">
        <LoginField label="PIN">
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              name="identifier"
              required
              inputMode="numeric"
              pattern="[0-9]{4,8}"
              autoFocus
              autoComplete="one-time-code"
              defaultValue={prefillPin}
              placeholder="026389"
              className="block h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-3 text-center font-mono text-lg tracking-[0.4em] text-[#0b1d3a] placeholder:font-normal placeholder:tracking-[0.3em] placeholder:text-slate-300 transition focus:border-[#0b1d3a] focus:outline-none focus:ring-4 focus:ring-[#0b1d3a]/10"
            />
          </div>
        </LoginField>

        {/* Password input is required by /login's signIn action shape but
            unused for PIN auth — submit empty. */}
        <input type="hidden" name="password" value="" />

        <button
          type="submit"
          className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[#22d3ee] via-[#2563eb] to-[#1d4ed8] text-sm font-bold uppercase tracking-[0.22em] text-white shadow-[0_18px_36px_-12px_rgba(37,99,235,0.55),inset_0_1px_0_rgba(255,255,255,0.20)] transition-all duration-300 hover:brightness-[1.08] active:translate-y-px"
        >
          <span className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          Entrar
          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </form>
    </PortalLoginCard>
  );
}
