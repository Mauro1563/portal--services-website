/**
 * Public preview: Owner → Marketing. Fully mocked, useState-only.
 * Same shape as /owner/marketing but every interaction lives in component state.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Facebook,
  FileText,
  Globe,
  Image as ImageIcon,
  Info,
  Instagram,
  Linkedin,
  MessageCircle,
  Plus,
  Printer,
  QrCode,
  Share2,
  Sparkles,
  Tag,
  Twitter,
  X,
} from 'lucide-react';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';

type PromoCode = {
  code: string;
  off: number;
  validUntil: string; // ISO date
  uses: number;
};

const INITIAL_URL = 'https://portalservices.digital/c/alan-cleaners-demo';
const INITIAL_PROMOS: PromoCode[] = [
  { code: 'WELCOME10', off: 10, validUntil: '2026-12-31', uses: 14 },
  { code: 'SUMMER25', off: 25, validUntil: '2026-09-30', uses: 3 },
];
const SHARE_MESSAGE_TEMPLATE = 'Reserva tu limpieza en 30 segundos: <link>';

type Tone = 'emerald' | 'blue' | 'pink' | 'sky' | 'indigo';

const TONE_CLS: Record<Tone, string> = {
  emerald: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
  blue: 'border-blue-200 text-blue-700 hover:bg-blue-50',
  pink: 'border-pink-200 text-pink-700 hover:bg-pink-50',
  sky: 'border-sky-200 text-sky-700 hover:bg-sky-50',
  indigo: 'border-indigo-200 text-indigo-700 hover:bg-indigo-50',
};

export default function OwnerMarketingPreview() {
  const [publicUrl] = useState<string>(INITIAL_URL);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMOS);
  const shareMessage = SHARE_MESSAGE_TEMPLATE.replace('<link>', publicUrl);

  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // New-promo modal state
  const [showNew, setShowNew] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newOff, setNewOff] = useState('15');
  const [newDate, setNewDate] = useState('2026-12-31');

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 1800);
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast('No se pudo copiar');
    }
  }

  function openShare(href: string) {
    window.open(href, '_blank', 'noopener,noreferrer');
  }

  function createPromo() {
    const code = newCode.trim().toUpperCase();
    const off = Number.parseInt(newOff, 10);
    if (!code || !Number.isFinite(off) || off <= 0 || !newDate) return;
    setPromoCodes((prev) => [
      ...prev,
      { code, off, validUntil: newDate, uses: 0 },
    ]);
    setNewCode('');
    setNewOff('15');
    setNewDate('2026-12-31');
    setShowNew(false);
    showToast('Código creado');
  }

  function deletePromo(code: string) {
    setPromoCodes((prev) => prev.filter((p) => p.code !== code));
    showToast('Código eliminado');
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(publicUrl)}&size=200x200`;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5">
          <Link
            href="/owner/preview"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Demo · Marketing
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-6">
        {/* Demo banner */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
          <span aria-hidden>📣</span> Demo — todos los cambios viven en tu navegador.
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
          Crecimiento
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Marketing y promoción
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Comparte tu negocio, lanza descuentos y descarga material para captar más clientes.
        </p>

        {/* 1. Public link + QR */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <Globe className="h-4 w-4 text-blue-600" /> Tu enlace público
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            El enlace que los clientes usan para reservar contigo. Compártelo donde quieras.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <code className="min-w-0 flex-1 truncate font-mono text-xs text-slate-800">
              {publicUrl}
            </code>
            <button
              type="button"
              onClick={copyUrl}
              title="Copiar enlace al portapapeles"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copiar
                </>
              )}
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Abrir
            </a>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex h-[180px] w-[180px] items-center justify-center self-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:self-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt={`Código QR para ${publicUrl}`}
                width={160}
                height={160}
                className="h-[160px] w-[160px]"
              />
            </div>
            <div className="text-xs text-slate-600">
              <p className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                <QrCode className="h-3.5 w-3.5 text-blue-600" /> Código QR para imprimir
              </p>
              <p className="mt-2 leading-relaxed">
                Imprime el QR y pégalo en recibos, flyers o el parabrisas de tu vehículo.
                Los clientes escanean y van directo a tu landing.
              </p>
              <a
                href={qrSrc}
                target="_blank"
                rel="noopener noreferrer"
                download="qr-alan-cleaners-demo.png"
                className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Descargar QR
              </a>
            </div>
          </div>
        </section>

        {/* 2. Social share buttons */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <Share2 className="h-4 w-4 text-blue-600" /> Comparte en redes
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Mensaje pre-armado:{' '}
            <span className="italic">&ldquo;{shareMessage}&rdquo;</span>
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            <SocialButton
              label="WhatsApp"
              Icon={MessageCircle}
              tone="emerald"
              onClick={() =>
                openShare(
                  `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
                )
              }
            />
            <SocialButton
              label="Facebook"
              Icon={Facebook}
              tone="blue"
              onClick={() =>
                openShare(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}&quote=${encodeURIComponent(shareMessage)}`,
                )
              }
            />
            <SocialButton
              label="Instagram"
              Icon={Instagram}
              tone="pink"
              hint="Pega en tu bio"
              onClick={() => openShare('https://www.instagram.com/')}
            />
            <SocialButton
              label="X / Twitter"
              Icon={Twitter}
              tone="sky"
              onClick={() =>
                openShare(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
                )
              }
            />
            <SocialButton
              label="LinkedIn"
              Icon={Linkedin}
              tone="indigo"
              onClick={() =>
                openShare(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`,
                )
              }
            />
          </div>
        </section>

        {/* 3. Promo codes */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
                <Tag className="h-4 w-4 text-blue-600" /> Códigos promocionales
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Genera descuentos para regalar a clientes nuevos o recurrentes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNew(true)}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Crear código
            </button>
          </div>

          {promoCodes.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-500">
              Sin códigos activos. Crea el primero.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200">
              {promoCodes.map((c) => (
                <li
                  key={c.code}
                  className="flex flex-wrap items-center gap-3 bg-white px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-semibold text-slate-900">
                      {c.code}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Válido hasta{' '}
                      {new Date(c.validUntil).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                    -{c.off}%
                  </span>
                  <span className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                    {c.uses} usos
                  </span>
                  <button
                    type="button"
                    onClick={() => deletePromo(c.code)}
                    title={`Eliminar ${c.code}`}
                    aria-label={`Eliminar ${c.code}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 4. Landing preview */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-blue-600" /> Tu landing personalizada
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Así se ve tu página pública para los clientes.
          </p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-transparent">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white/60 px-4 py-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="truncate font-mono text-[10px] text-slate-400">
                {publicUrl}
              </span>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold text-blue-600 hover:underline"
              >
                Abrir
              </a>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                <span className="text-2xl font-bold text-blue-600">AC</span>
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-900">
                  Alan Cleaners Demo
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Limpieza profesional para hogares y propiedades de alquiler.
                </p>
                <p className="mt-2 line-clamp-3 text-[11px] text-slate-500">
                  Equipo de 4 cleaners cubriendo Soho, Shoreditch y Camden.
                  Reserva online, paga seguro, y olvídate de coordinar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Downloadables */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-blue-600" /> Material descargable
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Plantillas listas para imprimir o enviar a tus clientes.
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {(
              [
                { label: 'Flyer A5 (PDF)', Icon: FileText },
                { label: 'Tarjeta de visita', Icon: Printer },
                { label: 'Plantilla Instagram', Icon: ImageIcon },
              ] as const
            ).map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => showToast('Próximamente — feature en preparación')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Icon className="h-4 w-4 text-blue-600" />
                {label}
              </button>
            ))}
          </div>

          <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="h-3 w-3" /> En la versión completa, descargas un PDF
            con tu logo y datos pre-rellenados.
          </p>
        </section>
      </div>

      {/* New promo modal */}
      {showNew ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Crear código promocional
              </p>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createPromo();
              }}
              className="space-y-3 p-4"
            >
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Código
                </span>
                <input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="EJ. OTOÑO20"
                  autoFocus
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-sm uppercase"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Descuento (%)
                </span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newOff}
                  onChange={(e) => setNewOff(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Válido hasta
                </span>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="h-9 rounded-lg bg-white px-3 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Check className="h-3.5 w-3.5" /> Crear código
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}

      <DemoBottomTabBar active="more" />
    </main>
  );
}

function SocialButton({
  label,
  Icon,
  tone,
  hint,
  onClick,
}: {
  label: string;
  Icon: typeof MessageCircle;
  tone: Tone;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-12 flex-col items-center justify-center gap-0.5 rounded-xl border bg-white px-2 text-[11px] font-semibold transition ${TONE_CLS[tone]}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {hint ? <span className="text-[9px] font-normal opacity-70">{hint}</span> : null}
    </button>
  );
}
