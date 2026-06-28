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
  Droplets,
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
  SprayCan,
  Star,
  Tag,
  Twitter,
  Wind,
  X,
} from 'lucide-react';
import { DemoBottomTabBar } from '../_components/DemoBottomTabBar';
import { DemoSheet } from '@/components/preview/DemoSheet';
import {
  ASSET_FILENAMES,
  exportBusinessCard,
  exportFlyerA5,
  exportInstagramSquare,
} from './_lib/exporters';
import { useClientLocale, pickCopy } from '@/lib/use-locale-client';

const COPY = {
  en: {
    dashboard: 'Dashboard',
    demoLabel: 'Demo · Marketing',
    demoBanner: 'Demo — all changes live in your browser.',
    growth: 'Growth',
    marketingTitle: 'Marketing and promotion',
    marketingSubtitle: 'Share your business, run discounts and download materials to win more clients.',
    yourLink: 'Your public link',
    yourLinkHint: 'The link clients use to book with you. Share it anywhere.',
    copyLinkTitle: 'Copy link to clipboard',
    copied: 'Copied',
    copy: 'Copy',
    previewLanding: 'Landing preview',
    open: 'Open',
    linkNote: 'In the demo, this link shows a mockup. When you activate your real account this URL will be your actual public landing.',
    qrFor: (url: string) => `QR code for ${url}`,
    qrPrint: 'QR code to print',
    qrUsage: 'Print the QR and stick it on receipts, flyers or your van. Clients scan and go straight to your landing.',
    qrPoints: 'The QR points to your real URL once you activate your account.',
    downloadQr: 'Download QR',
    shareSocial: 'Share on social',
    sharePrebuilt: 'Pre-built message:',
    instaBio: 'Paste in your bio',
    promoCodes: 'Promo codes',
    promoCodesHint: 'Generate discounts to gift new or returning clients.',
    createCode: 'Create code',
    noCodes: 'No active codes. Create the first.',
    validUntil: 'Valid until',
    uses: (n: number) => `${n} uses`,
    deleteCode: (code: string) => `Delete ${code}`,
    yourLanding: 'Your custom landing',
    landingHint: 'This is how your public page looks to clients.',
    materials: 'Downloadable materials',
    materialsHint: 'Templates ready to print or send to your clients.',
    flyer: 'A5 flyer',
    businessCard: 'Business card',
    instagramTpl: 'Instagram template',
    generating: 'Generating…',
    downloadInfo: 'Downloaded in SVG with your logo and pre-filled details. Open them in any browser or editor to print or convert to PDF.',
    createPromoTitle: 'Create promo code',
    close: 'Close',
    code: 'Code',
    codePlaceholder: 'E.G. AUTUMN20',
    discountPct: 'Discount (%)',
    validUntilField: 'Valid until',
    cancel: 'Cancel',
    landingPreviewTitle: 'Preview of your public landing',
    landingDemo: 'Demo — this is how your site looks to a client',
    cleaningService: 'Cleaning service · London',
    alanLondon: 'Alan Cleaners · London',
    professional: 'Professional cleans in under 30 seconds.',
    bookClean: 'Book a clean',
    demoBookHere: 'Demo — the client would book here',
    services: 'Services',
    standard: 'Standard',
    deep: 'Deep',
    windows: 'Windows',
    happyClients: 'Happy clients',
    incredibleService: '“Amazing service”',
    thompson: '— Mr. Thompson, Soho',
    impeccable: '“On time and left the flat spotless.”',
    sarahK: '— Sarah K., Camden',
    poweredBy: 'Powered by Zapli',
    closeSheet: 'Close',
    couldNotCopy: 'Could not copy',
    couldNotGenerate: 'Could not generate the file',
    codeCreated: 'Code created',
    codeDeleted: 'Code deleted',
    generatingShort: 'Generating…',
    downloadedAs: (filename: string) => `Downloaded · ${filename}`,
    shareMsg: 'Book your clean in 30 seconds: <link>',
    initialPromo: 'WELCOME10',
    alanCleanersDemo: 'Alan Cleaners Demo',
    alanCleanersSubtitle: 'Professional cleaning for homes and rental properties.',
    alanCleanersDesc: 'Team of 4 cleaners covering Soho, Shoreditch and Camden. Book online, pay securely, and forget about coordinating.',
  },
  es: {
    dashboard: 'Dashboard',
    demoLabel: 'Demo · Marketing',
    demoBanner: 'Demo — todos los cambios viven en tu navegador.',
    growth: 'Crecimiento',
    marketingTitle: 'Marketing y promoción',
    marketingSubtitle: 'Comparte tu negocio, lanza descuentos y descarga material para captar más clientes.',
    yourLink: 'Tu enlace público',
    yourLinkHint: 'El enlace que los clientes usan para reservar contigo. Compártelo donde quieras.',
    copyLinkTitle: 'Copiar enlace al portapapeles',
    copied: 'Copiado',
    copy: 'Copiar',
    previewLanding: 'Vista previa del landing',
    open: 'Abrir',
    linkNote: 'En el demo, este enlace muestra un mockup. Al activar tu cuenta real este URL será tu landing pública verdadera.',
    qrFor: (url: string) => `Código QR para ${url}`,
    qrPrint: 'Código QR para imprimir',
    qrUsage: 'Imprime el QR y pégalo en recibos, flyers o el parabrisas de tu vehículo. Los clientes escanean y van directo a tu landing.',
    qrPoints: 'El QR apunta a tu URL real cuando actives tu cuenta.',
    downloadQr: 'Descargar QR',
    shareSocial: 'Comparte en redes',
    sharePrebuilt: 'Mensaje pre-armado:',
    instaBio: 'Pega en tu bio',
    promoCodes: 'Códigos promocionales',
    promoCodesHint: 'Genera descuentos para regalar a clientes nuevos o recurrentes.',
    createCode: 'Crear código',
    noCodes: 'Sin códigos activos. Crea el primero.',
    validUntil: 'Válido hasta',
    uses: (n: number) => `${n} usos`,
    deleteCode: (code: string) => `Eliminar ${code}`,
    yourLanding: 'Tu landing personalizada',
    landingHint: 'Así se ve tu página pública para los clientes.',
    materials: 'Material descargable',
    materialsHint: 'Plantillas listas para imprimir o enviar a tus clientes.',
    flyer: 'Flyer A5',
    businessCard: 'Tarjeta de visita',
    instagramTpl: 'Plantilla Instagram',
    generating: 'Generando…',
    downloadInfo: 'Se descargan en formato SVG con tu logo y datos pre-rellenados. Ábrelos en cualquier navegador o editor para imprimir o convertir a PDF.',
    createPromoTitle: 'Crear código promocional',
    close: 'Cerrar',
    code: 'Código',
    codePlaceholder: 'EJ. OTOÑO20',
    discountPct: 'Descuento (%)',
    validUntilField: 'Válido hasta',
    cancel: 'Cancelar',
    landingPreviewTitle: 'Vista previa de tu landing pública',
    landingDemo: 'Demo — así se ve tu sitio cuando un cliente lo abre',
    cleaningService: 'Cleaning service · London',
    alanLondon: 'Alan Cleaners · London',
    professional: 'Limpiezas profesionales en menos de 30 segundos.',
    bookClean: 'Reservar limpieza',
    demoBookHere: 'Demo — el cliente reservaría aquí',
    services: 'Servicios',
    standard: 'Estándar',
    deep: 'Profunda',
    windows: 'Cristales',
    happyClients: 'Clientes felices',
    incredibleService: '“Increíble servicio”',
    thompson: '— Mr. Thompson, Soho',
    impeccable: '“Puntuales y dejaron el piso impecable.”',
    sarahK: '— Sarah K., Camden',
    poweredBy: 'Powered by Zapli',
    closeSheet: 'Cerrar',
    couldNotCopy: 'No se pudo copiar',
    couldNotGenerate: 'No se pudo generar el archivo',
    codeCreated: 'Código creado',
    codeDeleted: 'Código eliminado',
    generatingShort: 'Generando…',
    downloadedAs: (filename: string) => `Descargado · ${filename}`,
    shareMsg: 'Reserva tu limpieza en 30 segundos: <link>',
    initialPromo: 'WELCOME10',
    alanCleanersDemo: 'Alan Cleaners Demo',
    alanCleanersSubtitle: 'Limpieza profesional para hogares y propiedades de alquiler.',
    alanCleanersDesc: 'Equipo de 4 cleaners cubriendo Soho, Shoreditch y Camden. Reserva online, paga seguro, y olvídate de coordinar.',
  },
  pt: {
    dashboard: 'Dashboard',
    demoLabel: 'Demo · Marketing',
    demoBanner: 'Demo — todas as alterações vivem no teu navegador.',
    growth: 'Crescimento',
    marketingTitle: 'Marketing e promoção',
    marketingSubtitle: 'Partilha o teu negócio, lança descontos e descarrega material para captar mais clientes.',
    yourLink: 'O teu link público',
    yourLinkHint: 'O link que os clientes usam para reservar contigo. Partilha onde quiseres.',
    copyLinkTitle: 'Copiar link para a área de transferência',
    copied: 'Copiado',
    copy: 'Copiar',
    previewLanding: 'Pré-visualização do landing',
    open: 'Abrir',
    linkNote: 'No demo, este link mostra um mockup. Ao ativar a tua conta real este URL será o teu landing público verdadeiro.',
    qrFor: (url: string) => `Código QR para ${url}`,
    qrPrint: 'Código QR para imprimir',
    qrUsage: 'Imprime o QR e cola-o em recibos, flyers ou no para-brisas do teu veículo. Os clientes digitalizam e vão direto ao teu landing.',
    qrPoints: 'O QR aponta para o teu URL real quando ativares a conta.',
    downloadQr: 'Descarregar QR',
    shareSocial: 'Partilha nas redes',
    sharePrebuilt: 'Mensagem pré-pronta:',
    instaBio: 'Cola na tua bio',
    promoCodes: 'Códigos promocionais',
    promoCodesHint: 'Gera descontos para oferecer a clientes novos ou recorrentes.',
    createCode: 'Criar código',
    noCodes: 'Sem códigos ativos. Cria o primeiro.',
    validUntil: 'Válido até',
    uses: (n: number) => `${n} utilizações`,
    deleteCode: (code: string) => `Eliminar ${code}`,
    yourLanding: 'O teu landing personalizado',
    landingHint: 'É assim que a tua página pública aparece aos clientes.',
    materials: 'Material descarregável',
    materialsHint: 'Modelos prontos para imprimir ou enviar aos teus clientes.',
    flyer: 'Flyer A5',
    businessCard: 'Cartão de visita',
    instagramTpl: 'Modelo Instagram',
    generating: 'A gerar…',
    downloadInfo: 'Descarregam em formato SVG com o teu logótipo e dados pré-preenchidos. Abre-os em qualquer navegador ou editor para imprimir ou converter para PDF.',
    createPromoTitle: 'Criar código promocional',
    close: 'Fechar',
    code: 'Código',
    codePlaceholder: 'EX. OUTONO20',
    discountPct: 'Desconto (%)',
    validUntilField: 'Válido até',
    cancel: 'Cancelar',
    landingPreviewTitle: 'Pré-visualização do teu landing público',
    landingDemo: 'Demo — é assim que o teu site fica quando um cliente o abre',
    cleaningService: 'Cleaning service · London',
    alanLondon: 'Alan Cleaners · London',
    professional: 'Limpezas profissionais em menos de 30 segundos.',
    bookClean: 'Reservar limpeza',
    demoBookHere: 'Demo — o cliente reservaria aqui',
    services: 'Serviços',
    standard: 'Padrão',
    deep: 'Profunda',
    windows: 'Vidros',
    happyClients: 'Clientes felizes',
    incredibleService: '“Serviço incrível”',
    thompson: '— Mr. Thompson, Soho',
    impeccable: '“Pontuais e deixaram a casa impecável.”',
    sarahK: '— Sarah K., Camden',
    poweredBy: 'Powered by Zapli',
    closeSheet: 'Fechar',
    couldNotCopy: 'Não foi possível copiar',
    couldNotGenerate: 'Não foi possível gerar o ficheiro',
    codeCreated: 'Código criado',
    codeDeleted: 'Código eliminado',
    generatingShort: 'A gerar…',
    downloadedAs: (filename: string) => `Descarregado · ${filename}`,
    shareMsg: 'Reserva a tua limpeza em 30 segundos: <link>',
    initialPromo: 'WELCOME10',
    alanCleanersDemo: 'Alan Cleaners Demo',
    alanCleanersSubtitle: 'Limpeza profissional para casas e propriedades de aluguer.',
    alanCleanersDesc: 'Equipa de 4 cleaners a cobrir Soho, Shoreditch e Camden. Reserva online, paga em segurança, e esquece a coordenação.',
  },
} as const;

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

type Tone = 'emerald' | 'blue' | 'pink' | 'sky' | 'indigo';

const TONE_CLS: Record<Tone, string> = {
  emerald: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
  blue: 'border-blue-200 text-blue-700 hover:bg-blue-50',
  pink: 'border-pink-200 text-pink-700 hover:bg-pink-50',
  sky: 'border-sky-200 text-sky-700 hover:bg-sky-50',
  indigo: 'border-indigo-200 text-indigo-700 hover:bg-indigo-50',
};

export default function OwnerMarketingPreview() {
  const locale = useClientLocale();
  const t = pickCopy(COPY, locale);
  const [publicUrl] = useState<string>(INITIAL_URL);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMOS);
  const shareMessage = t.shareMsg.replace('<link>', publicUrl);

  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showLandingPreview, setShowLandingPreview] = useState(false);

  // Track which downloadable is currently generating (for the disabled state).
  const [generating, setGenerating] = useState<string | null>(null);

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
      showToast(t.couldNotCopy);
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
    showToast(t.codeCreated);
  }

  function deletePromo(code: string) {
    setPromoCodes((prev) => prev.filter((p) => p.code !== code));
    showToast(t.codeDeleted);
  }

  async function downloadAsset(
    key: string,
    generator: () => Promise<Blob>,
    filename: string,
  ) {
    if (generating) return;
    setGenerating(key);
    showToast(t.generatingShort);
    try {
      const blob = await generator();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(t.downloadedAs(filename));
    } catch {
      showToast(t.couldNotGenerate);
    } finally {
      setGenerating(null);
    }
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
            <ArrowLeft className="h-4 w-4" /> {t.dashboard}
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {t.demoLabel}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-6">
        {/* Demo banner */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
          <span aria-hidden>📣</span> {t.demoBanner}
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
          {t.growth}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          {t.marketingTitle}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t.marketingSubtitle}
        </p>

        {/* 1. Public link + QR */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <Globe className="h-4 w-4 text-blue-600" /> {t.yourLink}
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            {t.yourLinkHint}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <code className="min-w-0 flex-1 truncate font-mono text-xs text-slate-800">
              {publicUrl}
            </code>
            <button
              type="button"
              onClick={copyUrl}
              title={t.copyLinkTitle}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> {t.copied}
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> {t.copy}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowLandingPreview(true)}
              title={t.previewLanding}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <ExternalLink className="h-3.5 w-3.5" /> {t.open}
            </button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            {t.linkNote}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex h-[180px] w-[180px] items-center justify-center self-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:self-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt={t.qrFor(publicUrl)}
                width={160}
                height={160}
                className="h-[160px] w-[160px]"
              />
            </div>
            <div className="text-xs text-slate-600">
              <p className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                <QrCode className="h-3.5 w-3.5 text-blue-600" /> {t.qrPrint}
              </p>
              <p className="mt-2 leading-relaxed">
                {t.qrUsage}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {t.qrPoints}
              </p>
              <a
                href={qrSrc}
                target="_blank"
                rel="noopener noreferrer"
                download="qr-alan-cleaners-demo.png"
                className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="h-3.5 w-3.5" /> {t.downloadQr}
              </a>
            </div>
          </div>
        </section>

        {/* 2. Social share buttons */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <Share2 className="h-4 w-4 text-blue-600" /> {t.shareSocial}
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            {t.sharePrebuilt}{' '}
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
              hint={t.instaBio}
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
                <Tag className="h-4 w-4 text-blue-600" /> {t.promoCodes}
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                {t.promoCodesHint}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNew(true)}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> {t.createCode}
            </button>
          </div>

          {promoCodes.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-xs text-slate-500">
              {t.noCodes}
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
                      {t.validUntil}{' '}
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
                    {t.uses(c.uses)}
                  </span>
                  <button
                    type="button"
                    onClick={() => deletePromo(c.code)}
                    title={t.deleteCode(c.code)}
                    aria-label={t.deleteCode(c.code)}
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
            <Sparkles className="h-4 w-4 text-blue-600" /> {t.yourLanding}
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            {t.landingHint}
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
              <button
                type="button"
                onClick={() => setShowLandingPreview(true)}
                className="text-[10px] font-semibold text-blue-600 hover:underline"
              >
                {t.open}
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                <span className="text-2xl font-bold text-blue-600">AC</span>
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-900">
                  {t.alanCleanersDemo}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {t.alanCleanersSubtitle}
                </p>
                <p className="mt-2 line-clamp-3 text-[11px] text-slate-500">
                  {t.alanCleanersDesc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Downloadables */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-blue-600" /> {t.materials}
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            {t.materialsHint}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {(
              [
                {
                  key: 'flyer',
                  label: t.flyer,
                  Icon: FileText,
                  generator: exportFlyerA5,
                  filename: ASSET_FILENAMES.flyer,
                },
                {
                  key: 'card',
                  label: t.businessCard,
                  Icon: Printer,
                  generator: exportBusinessCard,
                  filename: ASSET_FILENAMES.card,
                },
                {
                  key: 'instagram',
                  label: t.instagramTpl,
                  Icon: ImageIcon,
                  generator: exportInstagramSquare,
                  filename: ASSET_FILENAMES.instagram,
                },
              ] as const
            ).map(({ key, label, Icon, generator, filename }) => {
              const busy = generating === key;
              return (
                <button
                  key={label}
                  type="button"
                  disabled={generating !== null}
                  onClick={() => downloadAsset(key, generator, filename)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon className="h-4 w-4 text-blue-600" />
                  {busy ? t.generating : label}
                </button>
              );
            })}
          </div>

          <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="h-3 w-3" /> {t.downloadInfo}
          </p>
        </section>
      </div>

      {/* New promo modal */}
      {showNew ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {t.createPromoTitle}
              </p>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                aria-label={t.close}
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
                  {t.code}
                </span>
                <input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder={t.codePlaceholder}
                  autoFocus
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-sm uppercase"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {t.discountPct}
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
                  {t.validUntilField}
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
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  <Check className="h-3.5 w-3.5" /> {t.createCode}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Landing public preview sheet — mockup, not the real (dead) URL */}
      <DemoSheet
        open={showLandingPreview}
        onClose={() => setShowLandingPreview(false)}
        title={t.landingPreviewTitle}
        maxWidth="max-w-lg"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-600">
          {t.landingDemo}
        </p>

        <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Browser chrome */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span className="truncate font-mono text-[10px] text-slate-400">
              {publicUrl}
            </span>
            <span className="w-8" />
          </div>

          {/* Hero */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-5 py-6 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
              {t.cleaningService}
            </p>
            <h4 className="mt-1 text-xl font-bold leading-tight">
              {t.alanLondon}
            </h4>
            <p className="mt-2 text-[13px] leading-relaxed text-blue-50">
              {t.professional}
            </p>
            <button
              type="button"
              onClick={() => showToast(t.demoBookHere)}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-blue-700 shadow-sm hover:bg-blue-50"
            >
              {t.bookClean}
            </button>
          </div>

          {/* Services */}
          <div className="space-y-3 px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              {t.services}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { label: t.standard, price: '£45', Icon: SprayCan },
                  { label: t.deep, price: '£95', Icon: Droplets },
                  { label: t.windows, price: '£65', Icon: Wind },
                ] as const
              ).map(({ label, price, Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white p-3 text-center"
                >
                  <Icon className="h-5 w-5 text-blue-600" />
                  <p className="text-[11px] font-semibold text-slate-900">
                    {label}
                  </p>
                  <p className="text-[11px] font-bold text-blue-700">{price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-2 border-t border-slate-100 px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              {t.happyClients}
            </p>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
              <p className="mt-1.5 text-[12px] italic text-slate-700">
                {t.incredibleService}
              </p>
              <p className="mt-1 text-[10px] font-semibold text-slate-500">
                {t.thompson}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
              <p className="mt-1.5 text-[12px] italic text-slate-700">
                {t.impeccable}
              </p>
              <p className="mt-1 text-[10px] font-semibold text-slate-500">
                {t.sarahK}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-center">
            <p className="text-[10px] font-semibold text-slate-500">
              {t.poweredBy}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShowLandingPreview(false)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800"
          >
            {t.closeSheet}
          </button>
        </div>
      </DemoSheet>

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
