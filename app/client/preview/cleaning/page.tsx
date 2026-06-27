/**
 * Public preview: Client → Cleaning detail. Mocked data with real
 * photos and interactive rating/photo lightbox so a prospect can
 * actually click around. Wrapped in ClientShell so the bottom tab
 * bar (Inicio / Reservas / Chat / Perfil) stays available — no
 * dead ends, no need to hit the browser back button.
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  MapPin,
  MessageCircle,
  Star,
} from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import { DemoLightbox } from '@/components/preview/DemoLightbox';
import { DemoToast } from '@/components/preview/DemoSheet';
import { CleanerEtaRibbon } from '../_components/CleanerEtaRibbon';
import { DEMO_PHOTOS, LONDON_PROPERTIES, MOCK_CTX, PREVIEW_TOKEN } from '../_mock';

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

// Preset tip amounts shown as chips. £0 = no tip. "Otra" lets the
// client enter a custom amount — useful when the preset chips don't fit.
const TIP_OPTIONS = [0, 2, 5, 10];

export default function ClientCleaningPreview() {
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [photos, setPhotos] = useState(PHOTOS);
  const [tip, setTip] = useState<number>(0);
  const [customTipOpen, setCustomTipOpen] = useState(false);
  const [customTipDraft, setCustomTipDraft] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function deletePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setLightboxIndex(null);
    showToast('Foto eliminada');
  }

  return (
    <ClientShell
      ctx={MOCK_CTX}
      token={PREVIEW_TOKEN}
      activeTab="reservas"
      title="Detalle de limpieza"
      showBack
      backHref="/client/preview/cleanings"
    >
      <div className="space-y-4">
        {/* Live cleaner ETA ribbon — sticky-translucent at the top of
            the page so it follows scroll. Tap to expand the route. */}
        <CleanerEtaRibbon cleanerInitials="CR" cleanerName="Carmen R." />

        {/* Status header — solid emerald surface signals status without
            the medical-success gradient + glow cliché. */}
        <div className="rounded-2xl bg-emerald-600 p-5 text-white">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-white/85">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completada
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
            title="Abrir dirección en Google Maps"
            className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/90 underline-offset-2 hover:underline"
          >
            <MapPin className="h-3 w-3" /> {PROPERTY.address}
          </a>
        </div>

        {/* Cleaner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-500">
              Equipo asignado
            </p>
            <button
              type="button"
              aria-label="La persona que realizó esta visita"
              title="La persona que realizó esta visita"
              className="grid h-8 w-8 -m-2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-700 font-bold text-white">
              CR
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Carmen R.</p>
              <p className="text-xs text-slate-500">London Sparkle Cleaning Co.</p>
            </div>
            <Link
              href="/client/preview/messages"
              title="Enviar un mensaje a Carmen sobre esta limpieza"
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-700"
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
              onClick={() => photos.length > 0 && setLightboxIndex(0)}
              title="Abrir el visor de fotos con flechas para navegar"
              disabled={photos.length === 0}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-200 disabled:opacity-40"
            >
              <Camera className="h-3 w-3" /> Ver todas
            </button>
          </div>
          {photos.length === 0 ? (
            <p className="px-4 py-6 text-center text-[12px] text-slate-500">
              Eliminaste todas las fotos.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-1 p-1">
              {photos.map((p, i) => (
                <button
                  key={p.src + i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  title={`Ver foto: ${p.label}`}
                  className="relative aspect-square overflow-hidden rounded-lg ring-0 ring-blue-400 transition hover:ring-2 focus:outline-none focus-visible:ring-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={p.label}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 py-1 text-left text-[10px] font-semibold text-white">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          )}
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
            <button
              type="button"
              aria-label="Tu valoración ayuda a tu cleaner y al equipo a mejorar"
              title="Tu valoración ayuda a tu cleaner y al equipo a mejorar"
              className="grid h-8 w-8 -m-2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          </div>

          {submitted ? (
            <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-center ring-1 ring-inset ring-emerald-100">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
              <p className="mt-2 text-sm font-semibold text-emerald-800">
                ¡Gracias por tu valoración!
              </p>
              <p className="mt-0.5 text-xs text-emerald-700">
                {rating} estrella{rating === 1 ? '' : 's'}
                {tip > 0 ? ` + £${tip} de propina` : ''} enviadas a Carmen.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                title="Editar tu valoración"
                className="mt-3 rounded-full bg-white px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
              >
                Editar
              </button>
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

              {/* Tip selector */}
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Añadir propina (opcional)
                </p>
                <div className="mt-2 flex gap-2">
                  {TIP_OPTIONS.map((t) => {
                    const isPreset = TIP_OPTIONS.includes(tip) && !customTipOpen;
                    const active = isPreset && tip === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setCustomTipOpen(false);
                          setTip(t);
                        }}
                        title={
                          t === 0
                            ? 'Sin propina'
                            : `Añadir £${t} de propina a Carmen`
                        }
                        className={`flex-1 rounded-xl px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                          active
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t === 0 ? 'No' : `£${t}`}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomTipOpen(true);
                      setCustomTipDraft(
                        tip > 0 && !TIP_OPTIONS.includes(tip) ? String(tip) : '',
                      );
                    }}
                    title="Escribir un importe personalizado para la propina"
                    className={`flex-1 rounded-xl px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                      customTipOpen
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Otra
                  </button>
                </div>
                {customTipOpen ? (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-500">£</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={customTipDraft}
                      onChange={(e) => {
                        setCustomTipDraft(e.target.value);
                        const n = Number(e.target.value);
                        setTip(Number.isFinite(n) && n >= 0 ? n : 0);
                      }}
                      placeholder="Importe"
                      autoFocus
                      className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm tabular-nums"
                    />
                  </div>
                ) : null}
                <p className="mt-2 text-[10.5px] font-semibold text-emerald-700">
                  100% para tu limpiador — Portal no retiene comisión.
                </p>
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comentario opcional…"
                title="Escribe un comentario para Carmen y el equipo"
                className="mt-4 block h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                title="Enviar tu valoración a Carmen y al equipo"
                className="mt-3 block w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Enviar valoración
              </button>
            </>
          )}
        </div>

        {/* Invoice + rebook actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => showToast('Factura enviada a tu email')}
            title="Pedir la factura de este servicio por email"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white px-3 py-2.5 text-[11.5px] font-bold uppercase tracking-wider text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
          >
            <FileText className="h-3.5 w-3.5" /> Pedir factura
          </button>
          <Link
            href="/client/preview/book?service=profunda"
            title="Reservar otra vez este mismo servicio"
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-3 py-2.5 text-[11.5px] font-bold uppercase tracking-wider text-white hover:bg-blue-700"
          >
            Reservar otra vez
          </Link>
        </div>
      </div>

      {/* Lightbox with prev/next arrows + keyboard support */}
      <DemoLightbox
        photos={photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
        onDelete={deletePhoto}
      />

      <DemoToast show={toast != null} message={toast ?? ''} />
    </ClientShell>
  );
}
