/**
 * Public preview: Client → Cleaning detail. Mocked data with real
 * photos and interactive rating/photo lightbox so a prospect can
 * actually click around.
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Star,
  X,
} from 'lucide-react';
import { DEMO_PHOTOS, LONDON_PROPERTIES } from '../_mock';

const PROPERTY = LONDON_PROPERTIES.soho;
const MAPS_URL = `https://maps.google.com/?q=${encodeURIComponent(PROPERTY.address)}`;

const PHOTOS: { src: string; label: string }[] = [
  { src: DEMO_PHOTOS.kitchen,  label: 'Cocina' },
  { src: DEMO_PHOTOS.bathroom, label: 'Baño principal' },
  { src: DEMO_PHOTOS.bedroom,  label: 'Dormitorio' },
  { src: DEMO_PHOTOS.living,   label: 'Salón' },
  { src: DEMO_PHOTOS.floor,    label: 'Suelos' },
  { src: DEMO_PHOTOS.sink,     label: 'Fregadero' },
];

export default function ClientCleaningPreview() {
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between gap-4 px-4">
          <Link
            href="/client/preview"
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
            title="Volver al inicio"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Detalle de limpieza
          </span>
          <span className="-mr-2 h-9 w-9" aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 py-5 space-y-4">
        {/* Status header */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-[0_18px_36px_-14px_rgba(16,185,129,0.45)]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
            <CheckCircle2 className="h-3 w-3" /> Completada
          </div>
          <h1 className="mt-2 text-2xl font-semibold leading-tight">
            Limpieza profunda
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
            <Clock className="h-3.5 w-3.5" /> Ayer · 14:00 — 16:30
          </p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            title="Abrir en Google Maps"
            className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/85 underline-offset-2 hover:underline"
          >
            <MapPin className="h-3 w-3" /> {PROPERTY.address}
          </a>
        </div>

        {/* Cleaner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Equipo asignado
            </p>
            <span
              className="text-[10px] text-slate-400"
              title="La persona que realizó esta visita"
            >
              ?
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 font-bold text-white">
              CR
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Carmen R.</p>
              <p className="text-xs text-slate-500">London Sparkle Cleaning Co.</p>
            </div>
            <Link
              href="/client/preview/messages"
              title="Enviar un mensaje a Carmen sobre esta limpieza"
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-white hover:bg-slate-700"
            >
              <MessageCircle className="h-3 w-3" /> Chat
            </Link>
          </div>
        </div>

        {/* Photos — real images from this visit */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Fotos del trabajo
            </h3>
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              title="Ver todas las fotos en grande"
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-200"
            >
              <Camera className="h-3 w-3" /> Ver todas
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1">
            {PHOTOS.slice(0, 6).map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setLightboxIndex(i)}
                title={`Ver foto: ${p.label}`}
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={p.src}
                  alt={p.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1 text-left text-[9px] font-bold uppercase tracking-wider text-white">
                  {p.label}
                </span>
              </button>
            ))}
          </div>
          <div className="border-t border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-700">Lo que se hizo</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                Cocina completa (encimera, alacenas, horno)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                2 baños desinfectados
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                Aspirado + fregado general
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                Reposición de toallas + amenities
              </li>
            </ul>
          </div>
        </div>

        {/* Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">¿Cómo estuvo?</p>
            <span
              className="text-[10px] text-slate-400"
              title="Tu valoración ayuda a tu cleaner y al equipo a mejorar"
            >
              ?
            </span>
          </div>

          {submitted ? (
            <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-center ring-1 ring-inset ring-emerald-100">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
              <p className="mt-2 text-sm font-semibold text-emerald-800">
                ¡Gracias por tu valoración!
              </p>
              <p className="mt-0.5 text-xs text-emerald-700">
                {rating} estrella{rating === 1 ? '' : 's'} enviadas a Carmen.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-3 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    title={`Dar ${n} estrella${n === 1 ? '' : 's'}`}
                    className="transition hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        n <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comentario opcional…"
                className="mt-4 block h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                title="Enviar tu valoración a Carmen y al equipo"
                className="mt-3 block w-full rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_-10px_rgba(37,99,235,0.55)] transition hover:brightness-110"
              >
                Enviar valoración
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            title="Cerrar"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex max-h-full max-w-md flex-col gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={PHOTOS[lightboxIndex].src}
              alt={PHOTOS[lightboxIndex].label}
              className="max-h-[70vh] w-full rounded-2xl object-contain"
            />
            <p className="text-center text-xs font-bold uppercase tracking-wider text-white/80">
              {PHOTOS[lightboxIndex].label} · {lightboxIndex + 1} / {PHOTOS.length}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {PHOTOS.map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  title={`Ver ${p.label}`}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-2 ${
                    i === lightboxIndex ? 'ring-white' : 'ring-transparent opacity-60'
                  }`}
                >
                  <img src={p.src} alt={p.label} loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
