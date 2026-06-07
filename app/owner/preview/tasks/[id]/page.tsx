/**
 * Public preview: Owner → Task detail. Mocked data.
 */
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Star,
  User,
} from 'lucide-react';

export const metadata = {
  title: 'Preview · Task detail',
  robots: { index: false, follow: false },
};

export default function OwnerTaskDetailPreview() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-5">
          <Link href="/owner/preview/tasks" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Volver a Cleanings
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Preview · Task #1</span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              <Clock className="h-3 w-3" /> En curso
            </span>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">Apto Centro 4B</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" /> Calle Mayor 12, Madrid · Hoy 09:00 – 11:00
            </p>
          </div>
          <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Editar
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
          {/* Photo + details */}
          <section className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-[16/10] bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100">
                <div className="flex h-full items-center justify-center text-slate-400">
                  <Camera className="h-8 w-8" />
                  <span className="ml-2 text-sm">Foto del trabajo (cleaner subió)</span>
                </div>
              </div>
              <div className="border-t border-slate-100 p-4">
                <h3 className="text-sm font-semibold text-slate-700">Notas del cleaner</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Cocina, salón y 2 baños completados. Reposición de toallas hecha.
                  El detergente del baño se está acabando — comprar antes del lunes.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700">Check-in</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>09:02 · GPS confirmado en la propiedad</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>09:15 · Foto inicial subida</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                  <span>Foto final pendiente</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cleaner</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">CR</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Carmen R.</p>
                  <p className="text-xs text-slate-500">PIN 026389 · Activa</p>
                </div>
              </div>
              <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <MessageSquare className="h-3.5 w-3.5" /> Enviar mensaje
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cliente</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">MG</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">María García</p>
                  <p className="text-xs text-slate-500">3 limpiezas/mes</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-amber-400">
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="ml-1 text-xs text-slate-600">4.9 avg</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Propiedad</h3>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
                  <Building2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Apto Centro 4B</p>
                  <p className="text-xs text-slate-500">2 dorm · 2 baños · 65m²</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
