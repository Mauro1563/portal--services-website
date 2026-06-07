/**
 * Public preview: Client → Cleaning detail. Mocked data.
 */
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Star,
  User,
} from 'lucide-react';

export const metadata = {
  title: 'Preview · Cleaning detail',
  robots: { index: false, follow: false },
};

export default function ClientCleaningPreview() {
  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between gap-4 px-4">
          <Link href="/client/preview" className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Cleaning</span>
          <span className="-mr-2 h-9 w-9" aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 py-5 space-y-4">
        {/* Status header */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-[0_18px_36px_-14px_rgba(16,185,129,0.45)]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
            <CheckCircle2 className="h-3 w-3" /> Completada
          </div>
          <h1 className="mt-2 text-2xl font-semibold leading-tight">Limpieza profunda</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
            <Clock className="h-3.5 w-3.5" /> Ayer · 14:00 — 16:30
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/80">
            <MapPin className="h-3 w-3" /> Calle Mayor 12, Madrid
          </p>
        </div>

        {/* Cleaner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Equipo asignado</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 font-bold text-white">CR</div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Carmen R.</p>
              <p className="text-xs text-slate-500">Limpiezas Premium</p>
            </div>
          </div>
        </div>

        {/* Before/after photos */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <Camera className="mx-auto h-6 w-6" />
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider">Antes</p>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 flex items-center justify-center text-blue-700">
              <div className="text-center">
                <Sparkles className="mx-auto h-6 w-6" />
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider">Después</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Lo que se hizo</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> Cocina completa (mesada, alacenas, horno)</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> 2 baños desinfectados</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> Aspirado + trapeado general</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> Reposición de toallas + amenities</li>
            </ul>
          </div>
        </div>

        {/* Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-center text-sm font-semibold text-slate-700">¿Cómo estuvo?</p>
          <div className="mt-3 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-8 w-8 ${n <= 5 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
              />
            ))}
          </div>
          <textarea
            placeholder="Comentario opcional…"
            className="mt-4 block h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />
          <button className="mt-3 block w-full rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_-10px_rgba(37,99,235,0.55)]">
            Enviar valoración
          </button>
        </div>
      </div>
    </main>
  );
}
