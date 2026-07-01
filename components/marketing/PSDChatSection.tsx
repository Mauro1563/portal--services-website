/**
 * PSDChatSection — Portal Chat · Chat Corporativo.
 *
 * Independent section between Workforce and Home per the v2 brief.
 * Presents Portal Chat as a distinct product surface with 11 features
 * grouped into 4 buckets: conversations, rich comms, organisation and
 * control. Includes a static preview mockup of the chat UI so the
 * feature list has a visual anchor.
 *
 * Palette: blue #10B981 primary accent (chat = communication), green
 * #10B981 for bullet checkmarks. Zero orange, zero emerald decoratively.
 */

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  MessageCircle,
  MessageSquare,
  Phone,
  Building2,
  Users,
  Pin,
  Bell,
  Search,
  Paperclip,
  ShieldAlert,
  Settings,
  Mic,
  Video,
  CheckCircle2,
  UserRound,
} from 'lucide-react';

const GROUPS = [
  {
    key: 'conversations',
    Icon: Users,
    features: ['buildingGroups', 'community', 'directWithPresence'],
  },
  {
    key: 'rich',
    Icon: Phone,
    features: ['voiceVideoCalls', 'voiceMessages', 'files'],
  },
  {
    key: 'organisation',
    Icon: Search,
    features: ['searchFilters', 'pinnedMessages', 'announcementsTickets'],
  },
  {
    key: 'control',
    Icon: ShieldAlert,
    features: ['emergencyCenter', 'hqAdmin'],
  },
] as const;

export default async function PSDChatSection() {
  const t = await getTranslations('psd.landing.chat');

  return (
    <section
      id="chat"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-24 sm:py-32"
      aria-labelledby="psd-chat-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[#10B981]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#2563EB]/8 blur-3xl"
      />
      {/* Fine grid overlay for texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#10B981] ring-1 ring-inset ring-[#10B981]/20">
            <MessageCircle className="h-3 w-3" aria-hidden />
            {t('eyebrow')}
          </span>
          <h2
            id="psd-chat-heading"
            className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            {t('body')}
          </p>
        </div>

        {/* Two-column: preview mockup + feature groups. Mockup renders
            FIRST on every viewport so the visual hook lands before the
            feature list — per user feedback that the info wasn't well
            projected when the mockup fell below the fold on mobile. */}
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left / top: chat preview mockup */}
          <div className="order-1 lg:order-1">
            {/* Green halo behind the mockup */}
            <div className="relative mx-auto max-w-md">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-3 rounded-[32px] bg-gradient-to-br from-[#10B981]/25 via-[#10B981]/10 to-[#2563EB]/15 blur-2xl"
              />
              {/* Floating live-activity chip */}
              <div className="absolute -right-3 -top-3 z-10 hidden items-center gap-2 rounded-full border border-[#10B981]/30 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-lg sm:inline-flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                </span>
                {t('preview.presenceLabel')}
              </div>
            <div
              aria-hidden="true"
              className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            >
              {/* Mockup top bar */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[13px] font-semibold text-slate-900">
                      {t('preview.groupName')}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                      {t('preview.presenceLabel')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  <Video className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Pinned announcement */}
              <div className="flex items-start gap-2 border-b border-slate-100 bg-[#10B981]/5 px-4 py-2 text-[11px] text-slate-700">
                <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10B981]" />
                <span className="leading-snug">{t('preview.pinnedAnnouncement')}</span>
              </div>

              {/* Message stream */}
              <div className="space-y-3 bg-slate-50/40 px-4 py-4">
                {/* Incoming — supervisor */}
                <div className="flex items-end gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#10B981]/15 text-[#10B981]">
                    <UserRound className="h-3.5 w-3.5" />
                  </span>
                  <div className="max-w-[75%]">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                      {t('preview.messages.supervisorName')} · {t('preview.messages.time1')}
                    </p>
                    <div className="mt-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[12px] text-slate-800 shadow-sm ring-1 ring-slate-200">
                      {t('preview.messages.supervisorText')}
                    </div>
                  </div>
                </div>

                {/* Voice message from operative */}
                <div className="flex items-end justify-end gap-2">
                  <div className="max-w-[75%]">
                    <p className="text-right text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                      {t('preview.messages.operativeName')} · {t('preview.messages.time2')}
                    </p>
                    <div className="mt-1 flex items-center gap-2 rounded-2xl rounded-br-sm bg-[#10B981] px-3 py-2 text-white shadow-sm">
                      <Mic className="h-3.5 w-3.5" />
                      <span className="inline-flex items-center gap-0.5">
                        {/* Waveform bars */}
                        <span className="h-2 w-0.5 rounded bg-white/60" />
                        <span className="h-3 w-0.5 rounded bg-white/70" />
                        <span className="h-4 w-0.5 rounded bg-white/80" />
                        <span className="h-2.5 w-0.5 rounded bg-white/70" />
                        <span className="h-3 w-0.5 rounded bg-white/60" />
                        <span className="h-4 w-0.5 rounded bg-white/80" />
                        <span className="h-2 w-0.5 rounded bg-white/60" />
                      </span>
                      <span className="text-[11px] tabular-nums">
                        {t('preview.messages.voiceDuration')}
                      </span>
                    </div>
                  </div>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-700">
                    <UserRound className="h-3.5 w-3.5" />
                  </span>
                </div>

                {/* Incoming — HQ with attachment */}
                <div className="flex items-end gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#10B981]/15 text-[#10B981]">
                    <UserRound className="h-3.5 w-3.5" />
                  </span>
                  <div className="max-w-[75%]">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                      {t('preview.messages.hqName')} · {t('preview.messages.time3')}
                    </p>
                    <div className="mt-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[12px] text-slate-800 shadow-sm ring-1 ring-slate-200">
                      {t('preview.messages.hqText')}
                      <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                        <Paperclip className="h-3 w-3 text-slate-500" />
                        <span className="text-[10.5px] font-medium text-slate-700">
                          {t('preview.attachmentName')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Composer */}
              <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5">
                <div className="flex-1 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] text-slate-500">
                  {t('preview.composerPlaceholder')}
                </div>
                <button
                  type="button"
                  tabIndex={-1}
                  className="grid h-8 w-8 place-items-center rounded-full bg-[#10B981] text-white"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            </div>
          </div>

          {/* Right / bottom: feature groups */}
          <div className="order-2 space-y-6 lg:order-2">
            {GROUPS.map(({ key, Icon, features }) => (
              <div key={key}>
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    {t(`groups.${key}.title`)}
                  </h3>
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-1">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]"
                        aria-hidden
                      />
                      <span>{t(`features.${feature}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA card — deep emerald gradient with dual color glow */}
        <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-[#052E2A] via-[#0F4C3A] to-[#059669] p-8 sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#34D399]/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#2563EB]/18 blur-3xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6EE7B7]">
                <Bell className="mr-1 inline h-3 w-3" aria-hidden />
                {t('ctaEyebrow')}
              </p>
              <h3 className="font-display mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {t('ctaTitle')}
              </h3>
              <p className="mt-3 max-w-xl text-white/75">{t('ctaBody')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#065F46] shadow-lg transition hover:shadow-xl"
              >
                {t('ctaPrimary')}
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="#demos"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                <Settings className="h-4 w-4" aria-hidden />
                {t('ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
