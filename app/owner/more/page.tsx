import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CreditCard,
  ExternalLink,
  Gift,
  Globe,
  LogOut,
  Megaphone,
  Palette,
  Settings,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { signout } from '@/app/login/actions';
import { LightLayout } from '@/components/owner/LightLayout';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { getT } from '@/lib/i18n';
import { getSuperAdminEmails } from '@/lib/super-admin';
import { Crown } from 'lucide-react';
import { getOwnerProfile } from '@/lib/owner-profile';

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  href: string;
  external?: boolean;
  showFor?: ('airbnb' | 'house_cleaning' | 'hybrid')[];
};

export default async function MorePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const t = await getT();
  const isSuperAdmin = getSuperAdminEmails().includes(
    (user.email ?? '').toLowerCase(),
  );
  const profile = await getOwnerProfile(user.id);
  const businessType = profile.business_type;

  const ALL_SECTIONS: { title: string; items: Item[] }[] = [
    {
      title: t('more.sectionOps'),
      items: [
        {
          icon: CalendarDays,
          label: t('more.calendar'),
          description: t('more.calendarDesc'),
          href: '/owner/calendar',
        },
        {
          icon: UserPlus,
          label: 'Clients',
          description: 'End-customers with their own portal + ratings.',
          href: '/owner/clients',
          showFor: ['house_cleaning', 'hybrid'],
        },
        {
          icon: Sparkles,
          label: 'Services',
          description: 'Regular, Deep, Move-out — with duration and price.',
          href: '/owner/services',
          showFor: ['house_cleaning', 'hybrid'],
        },
        {
          icon: Globe,
          label: 'Public profile',
          description: 'Your business landing page — share with customers.',
          href: '/owner/business-profile',
          showFor: ['house_cleaning', 'hybrid'],
        },
        {
          icon: Megaphone,
          label: 'Marketing',
          description: 'Enlace público, QR, redes, códigos promo y material para imprimir.',
          href: '/owner/marketing',
        },
        {
          icon: Gift,
          label: 'Referidos',
          description: 'Premios por recomendación que tus clientes pueden ganar.',
          href: '/owner/referrals',
          showFor: ['house_cleaning', 'hybrid'],
        },
        {
          icon: BarChart3,
          label: t('more.analytics'),
          description: t('more.analyticsDesc'),
          href: '/owner/analytics',
        },
      ],
    },
    {
      title: t('more.sectionAccount'),
      items: [
        {
          icon: CreditCard,
          label: t('more.billing'),
          description: t('more.billingDesc'),
          href: '/owner/billing',
        },
        {
          icon: Palette,
          label: 'Branding',
          description: 'Logo y colores que ven tus clientes en el portal.',
          href: '/owner/branding',
        },
        {
          icon: Settings,
          label: t('more.settings'),
          description: t('more.settingsDesc'),
          href: '/owner/settings',
        },
      ],
    },
    {
      title: t('more.sectionHelp'),
      items: [
        {
          icon: BookOpen,
          label: t('more.docs'),
          description: t('more.docsDesc'),
          href: 'https://portalservices.digital/docs',
          external: true,
        },
      ],
    },
  ];

  // Filter items by business type — hidden items remain accessible by URL
  const SECTIONS = ALL_SECTIONS.map((s) => ({
    ...s,
    items: s.items.filter(
      (it) => !it.showFor || it.showFor.includes(businessType),
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <LightLayout activeTab="more">
      <h1 className="font-display text-2xl font-semibold text-text-1">
        {t('more.title')}
      </h1>
      <p className="mt-1 text-sm text-text-2">{user.email}</p>

      {isSuperAdmin ? (
        <Link
          href="/hq"
          className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-300/40 bg-gradient-to-br from-amber-50 to-amber-100/60 p-4 shadow-card hover:shadow-card-lg"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
            <Crown className="h-5 w-5 text-amber-700" />
          </span>
          <div className="flex-1">
            <p className="font-display text-sm font-semibold text-text-1">
              HQ super-admin
            </p>
            <p className="mt-0.5 text-[11px] text-text-2">
              Manage every company that uses Zapli.
            </p>
          </div>
        </Link>
      ) : null}

      <div className="mt-6 space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-text-3">
              {section.title}
            </p>
            <ul className="mt-2 divide-y divide-surface-2 overflow-hidden rounded-2xl border border-surface-2 bg-surface-0 shadow-card">
              {section.items.map(({ icon: Icon, label, description, href, external }) => {
                const inner = (
                  <div className="flex items-center gap-3 px-4 py-3 transition hover:bg-surface-1">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-1">
                      <Icon className="h-4.5 w-4.5 text-brand-600" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-1">{label}</p>
                      <p className="truncate text-[11px] text-text-3">{description}</p>
                    </div>
                    {external ? (
                      <ExternalLink className="h-4 w-4 shrink-0 text-text-3" />
                    ) : (
                      <ChevronRight />
                    )}
                  </div>
                );
                return (
                  <li key={label}>
                    {external ? (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {inner}
                      </a>
                    ) : (
                      <Link href={href}>{inner}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div>
          <form action={signout}>
            <SubmitButton
              pendingLabel="Saliendo…"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-surface-2 bg-surface-0 text-sm font-medium text-rose-600 shadow-card transition hover:bg-rose-50 disabled:opacity-70"
            >
              <LogOut className="h-4 w-4" />
              {t('more.signOut')}
            </SubmitButton>
          </form>
        </div>
      </div>
    </LightLayout>
  );
}

function ChevronRight() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-text-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
