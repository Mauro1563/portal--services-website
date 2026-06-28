import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { type Locale } from '@/lib/i18n';

type Section = { title: string; body: string };
type Copy = {
  eyebrow: string;
  title: string;
  updated: string;
  sections: Section[];
  seeAlso: string;
  privacyLink: string;
  termsLink: string;
};

const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: 'Legal',
    title: 'Cookies Policy',
    updated: 'Last updated: 27 June 2026',
    sections: [
      {
        title: '1. What cookies are',
        body: 'Cookies are small text files a website stores on your device so it can remember things about you between visits — typically that you are signed in.',
      },
      {
        title: '2. What we use',
        body: 'Zapli uses a single first-party session cookie to keep you authenticated, plus a tiny preference cookie that remembers your chosen language. That is it. No advertising cookies, no third-party analytics that profile you across sites.',
      },
      {
        title: '3. Strictly necessary',
        body: 'The session cookie is strictly necessary to provide the service you signed up for. Disabling it will sign you out and prevent the app from working.',
      },
      {
        title: '4. Third-party services',
        body: 'When you pay through Stripe, Stripe sets its own cookies on its hosted checkout — governed by Stripe\'s own cookie policy. We do not control or read those cookies.',
      },
      {
        title: '5. Your choices',
        body: 'You can clear cookies at any time from your browser settings. You can sign out from the account menu to invalidate the current session cookie immediately.',
      },
      {
        title: '6. Changes',
        body: 'If we ever change what cookies we use, this page will be updated and material changes will be communicated in-app.',
      },
    ],
    seeAlso: 'See also our',
    privacyLink: 'Privacy Policy',
    termsLink: 'Terms of Service',
  },
  es: {
    eyebrow: 'Legal',
    title: 'Política de Cookies',
    updated: 'Última actualización: 27 de junio de 2026',
    sections: [
      {
        title: '1. Qué son las cookies',
        body: 'Las cookies son pequeños archivos de texto que un sitio guarda en tu dispositivo para recordar cosas entre visitas — normalmente que has iniciado sesión.',
      },
      {
        title: '2. Qué usamos',
        body: 'Zapli usa una única cookie de sesión propia para mantenerte autenticado, y una pequeña cookie de preferencias que recuerda tu idioma. Nada más. Ni cookies publicitarias ni analíticas de terceros que te perfilan entre sitios.',
      },
      {
        title: '3. Estrictamente necesarias',
        body: 'La cookie de sesión es estrictamente necesaria para prestar el servicio que has contratado. Desactivarla cerrará tu sesión e impedirá que la app funcione.',
      },
      {
        title: '4. Servicios de terceros',
        body: 'Cuando pagas vía Stripe, Stripe coloca sus propias cookies en su checkout — regidas por la política de cookies de Stripe. Nosotros no controlamos ni leemos esas cookies.',
      },
      {
        title: '5. Tus opciones',
        body: 'Puedes borrar las cookies en cualquier momento desde tu navegador. También puedes cerrar sesión desde el menú de cuenta para invalidar la cookie de sesión al instante.',
      },
      {
        title: '6. Cambios',
        body: 'Si alguna vez cambiamos las cookies que usamos, esta página se actualizará y los cambios relevantes se comunicarán en la propia app.',
      },
    ],
    seeAlso: 'Consulta también nuestra',
    privacyLink: 'Política de Privacidad',
    termsLink: 'Términos del Servicio',
  },
  pt: {
    eyebrow: 'Legal',
    title: 'Política de Cookies',
    updated: 'Última atualização: 27 de junho de 2026',
    sections: [
      {
        title: '1. O que são cookies',
        body: 'Cookies são pequenos ficheiros de texto que um site guarda no teu dispositivo para se lembrar de coisas entre visitas — normalmente que tens sessão iniciada.',
      },
      {
        title: '2. O que usamos',
        body: 'O Zapli usa um único cookie de sessão próprio para te manter autenticado, e um pequeno cookie de preferência que guarda o teu idioma. Mais nada. Sem cookies de publicidade nem analíticos de terceiros que te perfilam entre sites.',
      },
      {
        title: '3. Estritamente necessários',
        body: 'O cookie de sessão é estritamente necessário para prestar o serviço que contrataste. Desativá-lo encerra a tua sessão e impede a app de funcionar.',
      },
      {
        title: '4. Serviços de terceiros',
        body: 'Quando pagas via Stripe, a Stripe define os seus próprios cookies no checkout — regidos pela política de cookies da Stripe. Nós não controlamos nem lemos esses cookies.',
      },
      {
        title: '5. As tuas opções',
        body: 'Podes apagar cookies a qualquer momento nas definições do browser. Também podes terminar sessão no menu da conta para invalidar o cookie de sessão de imediato.',
      },
      {
        title: '6. Alterações',
        body: 'Se alguma vez mudarmos os cookies que usamos, esta página será atualizada e as alterações relevantes serão comunicadas na própria app.',
      },
    ],
    seeAlso: 'Vê também a nossa',
    privacyLink: 'Política de Privacidade',
    termsLink: 'Termos de Serviço',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = COPY[(locale as Locale) in COPY ? (locale as Locale) : 'en'];
  return {
    title: `${c.title} — Zapli`,
    description: c.sections[1].body,
  };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = COPY[(locale as Locale) in COPY ? (locale as Locale) : 'en'];

  return (
    <main className="relative overflow-hidden">
      <Nav />
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-mesh-1 opacity-90" />
        <div className="absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {c.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-3 text-sm text-slate-400">{c.updated}</p>
        </div>
      </section>

      <article className="relative py-12">
        <div className="mx-auto max-w-3xl space-y-8 px-6 text-slate-300">
          {c.sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-2xl font-semibold text-white">
                {s.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed">{s.body}</p>
            </section>
          ))}

          <p className="pt-6 text-sm text-slate-500">
            {c.seeAlso}{' '}
            <Link
              href={`/${locale}/privacy`}
              className="text-cyan-300 hover:text-cyan-200"
            >
              {c.privacyLink}
            </Link>{' '}
            ·{' '}
            <Link
              href={`/${locale}/terms`}
              className="text-cyan-300 hover:text-cyan-200"
            >
              {c.termsLink}
            </Link>
            .
          </p>
        </div>
      </article>

      <Footer />
    </main>
  );
}
