import { redirect } from 'next/navigation';
import { CheckCircle2, ExternalLink, Mail, XCircle } from 'lucide-react';
import { requireMarketingAdmin } from '@/lib/marketing';
import { HQShell } from '@/components/hq/Shell';
import { TestEmailButton } from './TestEmailButton';

export const dynamic = 'force-dynamic';

export default async function HQEmailTest() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const apiKeySet = Boolean(process.env.RESEND_API_KEY);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? 'Zapli <onboarding@resend.dev>';
  const usingSandboxSender = fromEmail.includes('onboarding@resend.dev');
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hq.portalservices.digital';

  return (
    <HQShell
      active="email-test"
      email={admin.email}
      title="Email · Test"
      subtitle="Verificá que Resend está configurado y manda emails desde producción."
    >
      <section className="rounded-2xl bg-paper p-5 ring-1 ring-line">
        <h2 className="font-display text-sm font-semibold text-graphite-1">
          Estado de la configuración
        </h2>
        <dl className="mt-4 space-y-3">
          <StatusRow
            ok={apiKeySet}
            label="RESEND_API_KEY"
            okText="Configurado en Vercel"
            badText="No configurado — los emails se saltan silenciosamente"
          />
          <StatusRow
            ok={!usingSandboxSender}
            label="RESEND_FROM_EMAIL"
            okText={`Usando ${fromEmail}`}
            badText={`Usando el sandbox de Resend (${fromEmail}) — los emails van a spam casi siempre`}
          />
          <StatusRow
            ok={true}
            label="NEXT_PUBLIC_SITE_URL"
            okText={siteUrl}
            badText=""
          />
        </dl>
      </section>

      <section className="mt-6 rounded-2xl bg-paper p-5 ring-1 ring-line">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-brand-700 ring-1 ring-inset ring-cyan-200">
            <Mail className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-sm font-semibold text-graphite-1">
              Enviar test
            </h2>
            <p className="mt-0.5 text-[12px] text-graphite-3">
              Te mando un email a <span className="font-mono">{admin.email}</span>.
              Revisá tu bandeja (y la carpeta de spam) después de 1–2 minutos.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <TestEmailButton />
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-cyan-50/60 p-5 ring-1 ring-inset ring-cyan-200">
        <h2 className="font-display text-sm font-semibold text-brand-700">
          Setup paso a paso
        </h2>
        <ol className="mt-3 space-y-2.5 text-[13px] text-graphite-2">
          <Step n={1}>
            Crear cuenta en{' '}
            <a
              href="https://resend.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-brand-700 hover:underline"
            >
              resend.com <ExternalLink className="h-3 w-3" />
            </a>{' '}
            (gratis hasta 3.000 emails/mes).
          </Step>
          <Step n={2}>
            En Resend → <strong>Domains</strong> → "Add Domain" → escribí{' '}
            <span className="font-mono">portalservices.digital</span>. Resend te
            da 3-4 registros DNS (SPF, DKIM, MX o DMARC).
          </Step>
          <Step n={3}>
            Agregá esos registros DNS en tu registrar (Namecheap, Cloudflare,
            etc.). Volvé a Resend y dale "Verify". Tarda 5–60 min.
          </Step>
          <Step n={4}>
            Resend → <strong>API Keys</strong> → "Create API Key" → copiá el
            valor (empieza con <span className="font-mono">re_</span>).
          </Step>
          <Step n={5}>
            En Vercel →{' '}
            <strong>Settings → Environment Variables</strong> agregá:
            <pre className="mt-1 overflow-x-auto rounded-lg bg-white p-2 text-[11px] text-graphite-1 ring-1 ring-inset ring-cyan-200">
              RESEND_API_KEY=re_xxxxxxxxxxxxxx{'\n'}
              RESEND_FROM_EMAIL=Zapli &lt;noreply@portalservices.digital&gt;
            </pre>
          </Step>
          <Step n={6}>
            Redeploy en Vercel (o esperá al próximo push). Volvé acá y dale
            "Enviar email de prueba".
          </Step>
        </ol>
      </section>
    </HQShell>
  );
}

function StatusRow({
  ok,
  label,
  okText,
  badText,
}: {
  ok: boolean;
  label: string;
  okText: string;
  badText: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
      )}
      <div className="min-w-0 flex-1">
        <dt className="text-[11px] font-bold uppercase tracking-wider text-graphite-3">
          {label}
        </dt>
        <dd className={`mt-0.5 text-[13px] ${ok ? 'text-graphite-1' : 'text-rose-700'}`}>
          {ok ? okText : badText}
        </dd>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[10px] font-bold text-white">
        {n}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  );
}
