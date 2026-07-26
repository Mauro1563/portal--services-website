import { getTranslations } from 'next-intl/server';
import { Download, Wifi, KeyRound, Bell } from 'lucide-react';
import { SectionHeader } from './PortalsGrid';

export async function RealtimeMobile() {
  const t = await getTranslations('psdSite.realtime');

  const bullets = [
    { label: t('b1'), Icon: Download },
    { label: t('b2'), Icon: Wifi },
    { label: t('b3'), Icon: KeyRound },
    { label: t('b4'), Icon: Bell },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <PhoneStack />

        <div>
          <div className="lg:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-psd-orange">
              {t('eyebrow')}
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-psd-navy sm:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-psd-textSoft sm:text-lg">
              {t('subtitle')}
            </p>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {bullets.map(({ label, Icon }) => (
              <li
                key={label}
                className="flex items-start gap-3 rounded-2xl border border-psd-border bg-psd-bg p-4"
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-gradient-to-br from-psd-orange to-psd-amber text-white shadow-[0_10px_20px_-10px_rgba(255,107,53,0.55)]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[14px] font-semibold text-psd-navy">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PhoneStack() {
  return (
    <div className="relative mx-auto flex h-[520px] w-full max-w-md items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-[48px] bg-gradient-to-br from-psd-blue/10 via-psd-cyan/10 to-transparent blur-3xl"
      />

      {/* Back phone — supervisor timesheet */}
      <div className="absolute left-4 top-8 w-[220px] rotate-[-6deg] transform overflow-hidden rounded-[32px] border border-psd-border bg-slate-950 p-1.5 shadow-[0_40px_80px_-20px_rgba(15,32,68,0.4)]">
        <div className="overflow-hidden rounded-[26px] bg-white">
          <div className="bg-psd-navy px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
              Timesheets
            </p>
            <p className="text-[13px] font-extrabold text-white">Semana 30</p>
          </div>
          <div className="space-y-2 p-3">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((d, i) => (
              <div
                key={d}
                className="flex items-center justify-between rounded-lg bg-psd-bg px-3 py-2 text-[11px]"
              >
                <span className="font-bold text-psd-navy">{d}</span>
                <span className="tabular-nums text-psd-textSoft">
                  8:0{i} · 17:0{i}
                </span>
                <span className="h-2 w-2 rounded-full bg-psd-green" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Front phone — operative clock-in */}
      <div className="absolute right-4 top-14 w-[240px] rotate-[4deg] transform overflow-hidden rounded-[36px] border border-psd-border bg-slate-950 p-1.5 shadow-[0_50px_100px_-20px_rgba(15,32,68,0.5)]">
        <div className="overflow-hidden rounded-[30px] bg-white">
          <div className="bg-gradient-to-br from-psd-orange to-psd-amber px-4 py-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/85">
              Attendance
            </p>
            <p className="mt-1 text-[16px] font-extrabold">Edificio B · Piso 3</p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold">
              <span className="h-2 w-2 rounded-full bg-white" />
              GPS · dentro de geocerca
            </div>
          </div>
          <div className="p-4">
            <button
              type="button"
              className="grid h-32 w-full place-items-center rounded-2xl bg-psd-navy text-white shadow-inner"
            >
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Tocar para fichar
                </div>
                <div className="mt-2 font-display text-2xl font-extrabold">
                  08:03
                </div>
                <div className="mt-1 text-[10px] font-semibold text-white/70">
                  Entrada
                </div>
              </div>
            </button>
            <p className="mt-3 text-center text-[10px] font-semibold text-psd-textSoft">
              Tu último cierre — Viernes 17:04
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
