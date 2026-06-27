import Link from 'next/link';
import LogoVariant1 from '@/components/logos/LogoVariant1';
import LogoVariant2 from '@/components/logos/LogoVariant2';
import LogoVariant3 from '@/components/logos/LogoVariant3';
import LogoVariant4 from '@/components/logos/LogoVariant4';

export const metadata = {
  title: 'Elegir logo · Portal Home',
  robots: { index: false, follow: false },
};

const variants = [
  { n: 1, Comp: LogoVariant1 },
  { n: 2, Comp: LogoVariant2 },
  { n: 3, Comp: LogoVariant3 },
  { n: 4, Comp: LogoVariant4 },
] as const;

export default function LogoPickerPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-7xl items-start justify-between gap-4 px-4 pt-8 pb-2 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Elige el nuevo logo de Portal Home
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Tócalas en tu móvil para ver cómo se ven al tamaño real. Dime qué
            número prefieres y la convierto en el logo oficial de todo el sitio.
          </p>
        </div>
        <Link
          href="/"
          className="shrink-0 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
        >
          Volver al sitio
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {variants.map(({ n, Comp }) => (
            <section
              key={n}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-base font-semibold text-slate-900">
                  Variante {n}
                </h2>
              </div>

              <div className="flex items-center justify-center bg-white px-4 py-8 ring-1 ring-inset ring-slate-200/60">
                <Comp size="lg" />
              </div>

              <div className="flex items-center justify-center border-t border-slate-200 bg-slate-50 px-4 py-5">
                <Comp size="sm" />
              </div>

              <div className="flex items-center justify-center border-t border-slate-800 bg-slate-900 px-4 py-8">
                <Comp size="lg" mono className="bg-slate-900 text-white" />
              </div>

              <div className="mt-auto border-t border-slate-200 p-4">
                <button
                  type="button"
                  title="Dile a Claude el número y la fijo como logo oficial"
                  className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  Elegir esta
                </button>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
