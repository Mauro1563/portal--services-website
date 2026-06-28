import Link from 'next/link';
import { MapPin, Radio } from 'lucide-react';
import { DemoLiveOpsPulse } from './DemoLiveOpsPulse';

export type DemoFieldCheckin = {
  taskId: string;
  cleanerName: string;
  propertyName: string;
  clientName: string;
  relative: string;
  lat?: number;
  lng?: number;
};

/**
 * Preview-only version of CleanersField — clay surface, hairline border,
 * mandarin pulse on the live indicator, mono metadata under each row.
 * Routes link to /owner/preview/tasks/<id> so the tour stays self-contained.
 */
export function DemoCleanersField({ checkins }: { checkins: DemoFieldCheckin[] }) {
  return (
    <section className="ps-set rounded-[12px] border border-[#1414141A] bg-[#E4DACA] p-5 md:p-6">
      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 font-mono text-[12px] text-[#54524D]">
            <Radio className="h-3 w-3 text-[#FF5B1F]" aria-hidden />
            en campo
            <span className="ml-0.5 inline-block h-[1px] w-5 align-middle bg-[#FF5B1F]" />
          </p>
          <h2
            className="mt-1 text-[28px] leading-[1] tracking-[-0.02em] text-[#141414] md:text-[32px]"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}
          >
            Operarios en campo
          </h2>
          <p className="mt-1 font-mono text-[11px] text-[#54524D]">
            {checkins.length} visitas · últimas 8 horas
          </p>
        </div>
        <Link
          href="/owner/preview/tasks"
          className="ps-link shrink-0 font-mono text-[12px] text-[#141414]"
        >
          Ver todos →
        </Link>
      </header>

      <DemoLiveOpsPulse />

      <ul className="mt-4 space-y-2">
        {checkins.map((c) => {
          const initials =
            c.cleanerName
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0] ?? '')
              .join('')
              .toUpperCase() || 'C';
          const mapHref =
            c.lat != null && c.lng != null
              ? `https://www.google.com/maps?q=${c.lat},${c.lng}`
              : null;
          return (
            <li
              key={c.taskId}
              className="group flex min-h-[64px] items-center gap-3 rounded-[12px] border border-[#1414141A] bg-[#F4EFE6] transition-colors hover:bg-[#F4EFE6]/60 focus-within:border-[#FF5B1F]"
              style={{ transitionDuration: '160ms' }}
            >
              <Link
                href={`/owner/preview/tasks/${c.taskId}`}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-l-[12px] px-3 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#FF5B1F]"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#1414141A] bg-[#E4DACA] font-mono text-[11px] font-bold text-[#141414]">
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#141414]">
                    {c.cleanerName}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-[#54524D]">
                    {c.clientName} · {c.propertyName} · {c.relative}
                  </p>
                </div>
              </Link>
              {mapHref ? (
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver ${c.propertyName} en el mapa`}
                  title="Abrir ubicación en Google Maps"
                  className="mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FF5B1F] text-[#1A0A04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                  style={{ transitionDuration: '160ms' }}
                >
                  <MapPin className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
