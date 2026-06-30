import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Cpu,
  DollarSign,
  GitBranch,
  Users,
  CreditCard,
  Shield,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { requireMarketingAdmin } from '@/lib/marketing';
import {
  getCompanyData,
  type Category,
  type CompanyItem,
} from '@/lib/notion-company';

export const dynamic = 'force-dynamic';

const CATEGORY_ORDER: Category[] = [
  'Stack',
  'Costos',
  'Repos',
  'Socios',
  'Cuentas',
  'Legal',
];

const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Stack: Cpu,
  Costos: DollarSign,
  Repos: GitBranch,
  Socios: Users,
  Cuentas: CreditCard,
  Legal: Shield,
};

const CATEGORY_DESCRIPTION: Record<Category, string> = {
  Stack: 'Tecnologias y servicios que sostienen el portal.',
  Costos: 'Suscripciones mensuales activas.',
  Repos: 'Repositorios de codigo.',
  Socios: 'Equity y equipo fundador.',
  Cuentas: 'Cuentas con acceso a servicios.',
  Legal: 'Documentos y cumplimiento.',
};

function maskEmail(email: string | null): string | null {
  if (!email) return null;
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) return `${local[0] ?? ''}***@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

function formatEur(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function StatusPill({ status }: { status: CompanyItem['status'] }) {
  if (!status) return null;
  const styles: Record<string, string> = {
    Activo: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    Inactivo: 'bg-slate-100 text-slate-600 ring-slate-200',
    Test: 'bg-amber-50 text-amber-700 ring-amber-200',
  };
  const cls = styles[status] ?? 'bg-slate-100 text-slate-600 ring-slate-200';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${cls}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: status === 'Activo' ? '#00D8C7' : 'currentColor' }}
      />
      {status}
    </span>
  );
}

function ItemCard({ item }: { item: CompanyItem }) {
  const masked = maskEmail(item.accountEmail);
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {item.name}
          </h3>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
            >
              <span className="truncate">
                {item.url.replace(/^https?:\/\//, '')}
              </span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          ) : null}
        </div>
        <StatusPill status={item.status} />
      </header>

      {item.notes ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {item.notes}
        </p>
      ) : null}

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        {item.owner ? (
          <div>
            <dt className="text-slate-400">Owner</dt>
            <dd className="font-medium text-slate-700">{item.owner}</dd>
          </div>
        ) : null}
        {masked ? (
          <div className="min-w-0">
            <dt className="text-slate-400">Cuenta</dt>
            <dd
              className="truncate font-mono text-[11px] text-slate-700"
              title={item.accountEmail ?? undefined}
            >
              {masked}
            </dd>
          </div>
        ) : null}
        {item.monthlyCost !== null && item.monthlyCost !== undefined ? (
          <div>
            <dt className="text-slate-400">Coste mensual</dt>
            <dd className="font-semibold text-slate-900">
              {formatEur(item.monthlyCost)}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}

function CategorySection({
  category,
  items,
  totalMonthly,
}: {
  category: Category;
  items: CompanyItem[];
  totalMonthly: number;
}) {
  const Icon = CATEGORY_ICON[category];

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{category}</h2>
            <p className="text-xs text-slate-500">
              {CATEGORY_DESCRIPTION[category]}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {category === 'Costos' && items.length > 0 ? (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-300">
              Total mensual
            </p>
            <p className="mt-1 text-3xl font-bold">
              {formatEur(totalMonthly)}
            </p>
          </div>
          <div className="text-right text-xs text-slate-300">
            <p>
              {items.length}{' '}
              {items.length === 1 ? 'suscripcion' : 'suscripciones'}
            </p>
            <p className="mt-0.5">
              <span
                className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ background: '#00D8C7' }}
              />
              recurrentes
            </p>
          </div>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-500">
            Sin items en esta categoria todavia.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function CompanyPage() {
  const admin = await requireMarketingAdmin();
  if (!admin) redirect('/hq/login');

  const data = await getCompanyData();

  const grouped: Record<Category, CompanyItem[]> = {
    Stack: [],
    Costos: [],
    Repos: [],
    Socios: [],
    Cuentas: [],
    Legal: [],
  };
  for (const item of data.items) {
    if (item.category in grouped) {
      grouped[item.category].push(item);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                HQ / Inventario
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Zapli Company
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Inventario vivo de la empresa: stack, costos, repos, socios,
                cuentas y legal. Fuente unica de verdad para auditoria interna.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: '#00D8C7' }}
                />
                {admin.email}
              </span>
              {data.connected ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Notion conectado
                </span>
              ) : (
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Sin Notion conectado &middot; usando datos de ejemplo
                </Link>
              )}
            </div>
          </div>

          {/* How to add items accordion */}
          <details className="group mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
            <summary className="cursor-pointer list-none font-medium text-slate-700 marker:hidden">
              <span className="inline-flex items-center gap-2">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: '#00D8C7' }}
                />
                Como agregar items?
                <span className="text-slate-400 group-open:hidden">+</span>
                <span className="hidden text-slate-400 group-open:inline">
                  &minus;
                </span>
              </span>
            </summary>
            <div className="mt-3 space-y-2 text-slate-600">
              <p>
                Edita la base de datos en Notion &mdash; la pagina la lee al
                refrescar.
              </p>
              <ol className="list-inside list-decimal space-y-1 text-xs">
                <li>
                  Abre la base de datos &ldquo;Zapli Company&rdquo; en Notion.
                </li>
                <li>
                  Crea o edita un row con las propiedades:{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] ring-1 ring-slate-200">
                    Name
                  </code>
                  ,{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] ring-1 ring-slate-200">
                    Category
                  </code>
                  ,{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] ring-1 ring-slate-200">
                    Status
                  </code>
                  ,{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] ring-1 ring-slate-200">
                    URL
                  </code>
                  ,{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] ring-1 ring-slate-200">
                    Monthly Cost
                  </code>
                  ,{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] ring-1 ring-slate-200">
                    Account Email
                  </code>
                  ,{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] ring-1 ring-slate-200">
                    Owner
                  </code>
                  ,{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] ring-1 ring-slate-200">
                    Notes
                  </code>
                  .
                </li>
                <li>
                  Recarga esta pagina &mdash; los cambios aparecen al instante
                  (force-dynamic).
                </li>
                <li>
                  Si no ves los datos reales, configura{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] ring-1 ring-slate-200">
                    NOTION_API_KEY
                  </code>{' '}
                  y{' '}
                  <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] ring-1 ring-slate-200">
                    NOTION_COMPANY_DB_ID
                  </code>{' '}
                  en Vercel.
                </li>
              </ol>
            </div>
          </details>
        </header>

        {/* Sections */}
        {CATEGORY_ORDER.map((category) => (
          <CategorySection
            key={category}
            category={category}
            items={grouped[category]}
            totalMonthly={data.totalMonthly}
          />
        ))}

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          Datos {data.connected ? 'desde Notion' : 'de ejemplo (fallback)'}
          {' '}&middot; {data.items.length} items totales
        </footer>
      </div>
    </div>
  );
}
