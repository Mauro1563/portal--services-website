/**
 * Public, no-auth preview of the Operative (cleaner) dashboard with mock
 * data. Linked from /hq/vistas. Skips the cookie/cleaner_session check
 * that the real /operative does.
 */
import {
  CalendarDays,
  CheckCircle2,
  Hammer,
  ListChecks,
  MapPin,
  Sun,
  UserCog,
} from 'lucide-react';
import {
  CorporateBanner,
  PortalHero,
  PortalShell,
  StatRow,
  ToolCard,
  ToolGrid,
} from '@/components/portal/PortalDashboardShell';

export const metadata = {
  title: 'Vista previa · Portal de la Limpiadora',
  robots: { index: false, follow: false },
};

export default function OperativePreview() {
  return (
    <PortalShell badge={{ label: 'Operative portal', icon: Hammer }}>
      <PortalHero
        portalLabel="Operative portal"
        portalIcon={Hammer}
        topRightChip={{ label: 'Day', icon: Sun }}
        greeting="Buenas tardes"
        displayName="Carmen"
        chips={[
          { kind: 'text', label: 'Turno: 09:00 — 17:00', icon: CalendarDays },
          { kind: 'status', status: 'online', label: 'on-site' },
        ]}
      />

      <StatRow
        items={[
          { label: 'Hoy', value: '4 / 6', sub: 'tareas' },
          { label: 'Check-in', value: '08:55', sub: 'a tiempo' },
          { label: 'Rating', value: '4.8', sub: 'este mes' },
        ]}
      />

      <ToolGrid>
        <ToolCard
          href="#"
          icon={ListChecks}
          title="Tareas de hoy"
          subtitle="2 pendientes"
          accent="brand"
        />
        <ToolCard
          href="#"
          icon={CheckCircle2}
          title="Check-in"
          subtitle="GPS activo"
          accent="emerald"
        />
        <ToolCard
          href="#"
          icon={MapPin}
          title="Mapa de propiedades"
          subtitle="Ver ruta"
          accent="amber"
        />
        <ToolCard
          href="#"
          icon={CalendarDays}
          title="Mi semana"
          subtitle="Próximas visitas"
          accent="navy"
        />
        <ToolCard
          href="#"
          icon={UserCog}
          title="Mi perfil"
          subtitle="Carmen · PIN 026389"
          accent="rose"
        />
      </ToolGrid>

      <CorporateBanner
        href="#"
        eyebrow="Próxima limpieza"
        title="Apto 4B · Calle Mayor 12"
        subtitle="14:00 — María García · cocina + 2 baños"
      />
    </PortalShell>
  );
}
