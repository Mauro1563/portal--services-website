import 'server-only';
import { Client } from '@notionhq/client';

export type Category = 'Stack' | 'Costos' | 'Repos' | 'Socios' | 'Cuentas' | 'Legal';

export type CompanyItem = {
  id: string;
  name: string;
  category: Category;
  status: 'Activo' | 'Inactivo' | 'Test' | null;
  url: string | null;
  monthlyCost: number | null;
  accountEmail: string | null;
  notes: string;
  owner: string | null;
};

export type CompanyData = {
  items: CompanyItem[];
  totalMonthly: number;
  connected: boolean;
};

const FALLBACK_ITEMS: CompanyItem[] = [
  // Stack
  {
    id: 'fb-stack-nextjs',
    name: 'Next.js 15 (App Router)',
    category: 'Stack',
    status: 'Activo',
    url: 'https://nextjs.org',
    monthlyCost: null,
    accountEmail: null,
    notes: 'Framework principal del portal. App Router + Server Components + Server Actions.',
    owner: 'Mauro',
  },
  {
    id: 'fb-stack-supabase',
    name: 'Supabase (Postgres + Auth + Storage)',
    category: 'Stack',
    status: 'Activo',
    url: 'https://supabase.com',
    monthlyCost: null,
    accountEmail: null,
    notes: 'Base de datos Postgres, autenticacion por magic link/OTP y storage de archivos (fotos de limpiadoras, comprobantes).',
    owner: 'Mauro',
  },
  {
    id: 'fb-stack-tailwind',
    name: 'Tailwind CSS + lucide-react',
    category: 'Stack',
    status: 'Activo',
    url: 'https://tailwindcss.com',
    monthlyCost: null,
    accountEmail: null,
    notes: 'Sistema de estilos utility-first y libreria de iconos.',
    owner: 'Mauro',
  },
  {
    id: 'fb-stack-nextintl',
    name: 'next-intl (i18n ES/EN)',
    category: 'Stack',
    status: 'Activo',
    url: 'https://next-intl-docs.vercel.app',
    monthlyCost: null,
    accountEmail: null,
    notes: 'Internacionalizacion de rutas y mensajes. Locales soportados: es, en.',
    owner: 'Mauro',
  },
  {
    id: 'fb-stack-notion',
    name: '@notionhq/client',
    category: 'Stack',
    status: 'Activo',
    url: 'https://developers.notion.com',
    monthlyCost: null,
    accountEmail: null,
    notes: 'SDK oficial de Notion para fetch del inventario de la empresa.',
    owner: 'Mauro',
  },

  // Costos
  {
    id: 'fb-cost-vercel',
    name: 'Vercel Pro',
    category: 'Costos',
    status: 'Activo',
    url: 'https://vercel.com',
    monthlyCost: 20,
    accountEmail: 'mauro541423@gmail.com',
    notes: 'Hosting del portal y previews. Plan Pro mensual.',
    owner: 'Mauro',
  },
  {
    id: 'fb-cost-supabase',
    name: 'Supabase Pro',
    category: 'Costos',
    status: 'Activo',
    url: 'https://supabase.com/pricing',
    monthlyCost: 25,
    accountEmail: 'mauro541423@gmail.com',
    notes: 'Plan Pro: 8 GB DB, 100 GB storage, daily backups.',
    owner: 'Mauro',
  },
  {
    id: 'fb-cost-resend',
    name: 'Resend (transactional email)',
    category: 'Costos',
    status: 'Activo',
    url: 'https://resend.com',
    monthlyCost: 20,
    accountEmail: 'mauro541423@gmail.com',
    notes: 'Emails transaccionales (confirmaciones de booking, magic links, notificaciones a limpiadoras).',
    owner: 'Mauro',
  },
  {
    id: 'fb-cost-domain',
    name: 'Dominio zapli.es (anual /12)',
    category: 'Costos',
    status: 'Activo',
    url: null,
    monthlyCost: 1,
    accountEmail: 'mauro541423@gmail.com',
    notes: 'Coste anual 12 EUR prorrateado mensualmente.',
    owner: 'Mauro',
  },
  {
    id: 'fb-cost-stripe',
    name: 'Stripe (fees por transaccion)',
    category: 'Costos',
    status: 'Activo',
    url: 'https://stripe.com',
    monthlyCost: 0,
    accountEmail: 'mauro541423@gmail.com',
    notes: 'Sin coste fijo mensual. 1.4% + 0.25 EUR por pago europeo, 2.9% + 0.25 EUR internacional.',
    owner: 'Mauro',
  },

  // Repos
  {
    id: 'fb-repo-portal',
    name: 'portal--services-website',
    category: 'Repos',
    status: 'Activo',
    url: 'https://github.com/zapli/portal--services-website',
    monthlyCost: null,
    accountEmail: null,
    notes: 'Repo principal: portal de reservas, dashboard de owners/cleaners, super admin, app iOS via Capacitor.',
    owner: 'Mauro',
  },
  {
    id: 'fb-repo-cleaner',
    name: 'home-cleaner-services',
    category: 'Repos',
    status: 'Activo',
    url: 'https://github.com/zapli/home-cleaner-services',
    monthlyCost: null,
    accountEmail: null,
    notes: 'Repo auxiliar de servicios de limpieza (legacy / experimentos).',
    owner: 'Mauro',
  },

  // Socios
  {
    id: 'fb-socio-mauro',
    name: 'Mauro (Founder & CEO)',
    category: 'Socios',
    status: 'Activo',
    url: null,
    monthlyCost: null,
    accountEmail: 'mauro541423@gmail.com',
    notes: 'Fundador unico. 100% del equity. Responsable de producto, ingenieria y operaciones.',
    owner: 'Mauro',
  },

  // Cuentas
  {
    id: 'fb-acc-stripe',
    name: 'Cuenta Stripe (billing/payouts)',
    category: 'Cuentas',
    status: 'Activo',
    url: 'https://dashboard.stripe.com',
    monthlyCost: null,
    accountEmail: 'mauro541423@gmail.com',
    notes: 'Cuenta principal de Stripe para cobros del portal y payouts a limpiadoras (Stripe Connect).',
    owner: 'Mauro',
  },
  {
    id: 'fb-acc-vercel',
    name: 'Cuenta Vercel (billing)',
    category: 'Cuentas',
    status: 'Activo',
    url: 'https://vercel.com/account',
    monthlyCost: null,
    accountEmail: 'mauro541423@gmail.com',
    notes: 'Cuenta de facturacion Vercel Pro. Tarjeta principal en archivo.',
    owner: 'Mauro',
  },
  {
    id: 'fb-acc-supabase',
    name: 'Cuenta Supabase (billing)',
    category: 'Cuentas',
    status: 'Activo',
    url: 'https://supabase.com/dashboard/account/billing',
    monthlyCost: null,
    accountEmail: 'mauro541423@gmail.com',
    notes: 'Cuenta de facturacion Supabase Pro.',
    owner: 'Mauro',
  },

  // Legal
  {
    id: 'fb-legal-gdpr',
    name: 'GDPR / DPA',
    category: 'Legal',
    status: 'Activo',
    url: null,
    monthlyCost: null,
    accountEmail: null,
    notes: 'Data Processing Agreement firmado con Supabase, Vercel, Resend y Stripe. Registro de actividades de tratamiento.',
    owner: 'Mauro',
  },
  {
    id: 'fb-legal-terms',
    name: 'Terminos y Condiciones',
    category: 'Legal',
    status: 'Activo',
    url: 'https://zapli.es/legal/terms',
    monthlyCost: null,
    accountEmail: null,
    notes: 'Terminos de uso del portal para clientes y limpiadoras. Version vigente.',
    owner: 'Mauro',
  },
  {
    id: 'fb-legal-privacy',
    name: 'Politica de Privacidad',
    category: 'Legal',
    status: 'Activo',
    url: 'https://zapli.es/legal/privacy',
    monthlyCost: null,
    accountEmail: null,
    notes: 'Politica de privacidad acorde a RGPD/LOPDGDD. Incluye uso de cookies y subprocesadores.',
    owner: 'Mauro',
  },
];

export async function getCompanyData(): Promise<CompanyData> {
  const token = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_COMPANY_DB_ID;

  if (!token || !dbId) {
    const total = FALLBACK_ITEMS
      .filter(i => i.category === 'Costos' && i.monthlyCost)
      .reduce((s, i) => s + (i.monthlyCost ?? 0), 0);
    return { items: FALLBACK_ITEMS, totalMonthly: total, connected: false };
  }

  try {
    const notion = new Client({ auth: token });
    const res = await notion.databases.query({ database_id: dbId, page_size: 100 });
    const items: CompanyItem[] = res.results
      .filter((r): r is Extract<typeof r, { properties: any }> => 'properties' in r)
      .map((page): CompanyItem => {
        const p = page.properties as Record<string, any>;
        const name = p.Name?.title?.[0]?.plain_text ?? '(sin nombre)';
        const category = (p.Category?.select?.name ?? 'Stack') as Category;
        const status = p.Status?.select?.name ?? null;
        const url = p.URL?.url ?? null;
        const monthlyCost = p['Monthly Cost']?.number ?? null;
        const accountEmail = p['Account Email']?.email ?? null;
        const notes = p.Notes?.rich_text?.map((t: any) => t.plain_text).join('') ?? '';
        const owner = p.Owner?.rich_text?.[0]?.plain_text ?? null;
        return { id: page.id, name, category, status, url, monthlyCost, accountEmail, notes, owner };
      });
    const total = items
      .filter(i => i.category === 'Costos' && i.monthlyCost)
      .reduce((s, i) => s + (i.monthlyCost ?? 0), 0);
    return { items, totalMonthly: total, connected: true };
  } catch (err) {
    console.error('[notion-company]', err);
    return { items: FALLBACK_ITEMS, totalMonthly: 0, connected: false };
  }
}
