'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Tab = 'owner' | 'client' | 'cleaner';

const TABS: Tab[] = ['owner', 'client', 'cleaner'];

export function InteractiveDemo() {
  const t = useTranslations('psd.demo');
  const [active, setActive] = useState<Tab>('owner');

  return (
    <div className="demo-shell" aria-label="Product preview">
      <div className="demo-tabs" role="tablist">
        {TABS.map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={active === k}
            className={`demo-tab ${active === k ? 'active' : ''}`}
            onClick={() => setActive(k)}
          >
            {t(`tabs.${k}`)}
          </button>
        ))}
      </div>

      <div className="demo-frame">
        {active === 'owner' && <OwnerPanel />}
        {active === 'client' && <ClientPanel />}
        {active === 'cleaner' && <CleanerPanel />}
      </div>
    </div>
  );
}

function OwnerPanel() {
  const t = useTranslations('psd.demo.owner');
  const activity = [
    { k: 'a1', tone: 'ok' as const },
    { k: 'a2', tone: 'live' as const },
    { k: 'a3', tone: 'star' as const },
  ];
  return (
    <div className="demo-panel demo-dark fade-up">
      <div className="demo-head">
        <span>{t('header')}</span>
        <span className="demo-pill"><span className="dot" />LIVE</span>
      </div>
      <div className="demo-kpis">
        <Kpi value={t('kpi1.value')} label={t('kpi1.label')} tone="green" />
        <Kpi value={t('kpi2.value')} label={t('kpi2.label')} tone="orange" />
        <Kpi value={t('kpi3.value')} label={t('kpi3.label')} tone="amber" />
      </div>
      <div className="demo-activity">
        {activity.map((it) => (
          <div className="demo-act" key={it.k}>
            <span className={`demo-act-dot tone-${it.tone}`} />
            <div className="demo-act-meta">
              <div className="demo-act-who">{t(`${it.k}.who`)}</div>
              <div className="demo-act-what">{t(`${it.k}.what`)}</div>
            </div>
            <div className="demo-act-when">{t(`${it.k}.when`)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientPanel() {
  const t = useTranslations('psd.demo.client');
  return (
    <div className="demo-panel demo-light fade-up">
      <div className="demo-head demo-head-light">{t('header')}</div>
      <div className="demo-next">
        <div className="demo-next-eyebrow">{t('nextLabel')}</div>
        <div className="demo-next-date">{t('nextDate')}</div>
        <div className="demo-next-cleaner">{t('nextCleaner')}</div>
      </div>
      <div className="demo-points">
        <div className="demo-points-eyebrow">{t('pointsLabel')}</div>
        <div className="demo-points-bar">
          <div className="demo-points-fill" style={{ width: '68%' }} />
        </div>
        <div className="demo-points-detail">{t('pointsDetail')}</div>
      </div>
      <div className="demo-last">
        <div className="demo-last-eyebrow">{t('lastLabel')}</div>
        <div className="demo-last-detail">{t('lastDetail')}</div>
      </div>
    </div>
  );
}

function CleanerPanel() {
  const t = useTranslations('psd.demo.cleaner');
  const [items, setItems] = useState<{ k: 'bath' | 'kitchen' | 'lounge'; done: boolean }[]>([
    { k: 'bath', done: true },
    { k: 'kitchen', done: true },
    { k: 'lounge', done: false },
  ]);
  const toggle = (i: number) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, done: !it.done } : it)));
  return (
    <div className="demo-panel demo-dark fade-up">
      <div className="demo-head">
        <span>{t('header')}</span>
        <span className="demo-pill"><span className="dot" />ON SHIFT</span>
      </div>
      <div className="demo-shift">
        <div className="demo-shift-time">{t('shiftLabel')}</div>
        <div className="demo-shift-where">{t('shiftWhere')}</div>
      </div>
      <div className="demo-checklist">
        {items.map((it, i) => (
          <button
            key={it.k}
            type="button"
            className={`demo-check-row ${it.done ? 'done' : ''}`}
            onClick={() => toggle(i)}
          >
            <span className="demo-check-box">{it.done ? '✓' : ''}</span>
            <span className="demo-check-label">{t(it.k)}</span>
          </button>
        ))}
      </div>
      <div className="demo-checkin">{t('checkin')}</div>
    </div>
  );
}

function Kpi({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: 'green' | 'orange' | 'amber';
}) {
  return (
    <div className={`demo-kpi tone-${tone}`}>
      <div className="demo-kpi-v">{value}</div>
      <div className="demo-kpi-l">{label}</div>
    </div>
  );
}
