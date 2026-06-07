/**
 * Public, no-auth PREVIEW of the client portal — same components rendering
 * with fully mocked context so you can see what the client experiences
 * without needing a real magic-link token. Linked from /hq/vistas.
 */
import {
  CalendarDays,
  Gift,
  Home,
  ListChecks,
  MessageCircle,
  Sparkles,
  Star,
  Sun,
} from 'lucide-react';
import { ClientShell } from '@/components/client/ClientShell';
import {
  CorporateBanner,
  PortalHero,
  StatRow,
  ToolCard,
  ToolGrid,
} from '@/components/portal/PortalDashboardShell';

export const metadata = {
  title: 'Vista previa · Portal del cliente',
  robots: { index: false, follow: false },
};

const MOCK_CTX = {
  client: {
    id: 'preview',
    owner_id: 'preview',
    name: 'María García',
    email: 'maria@example.com',
    phone: null,
    address: null,
    notes: null,
    access_token: 'preview',
    referral_code: 'PREVIEW',
    created_at: new Date().toISOString(),
  },
  owner: {
    business_name: 'Limpiezas Premium',
    business_logo_url: null,
    business_type: 'hybrid' as const,
    email: null,
  },
};

export default function ClientPreview() {
  return (
    <ClientShell ctx={MOCK_CTX} activeTab="home">
      <PortalHero
        portalLabel="Client portal"
        portalIcon={Home}
        topRightChip={{ label: 'Day', icon: Sun }}
        greeting="Buenas tardes"
        displayName="María"
        chips={[
          { kind: 'text', label: 'Limpiezas Premium', icon: Sparkles },
          { kind: 'status', status: 'online', label: 'online' },
        ]}
      />

      <StatRow
        items={[
          { label: 'Next visit', value: 'Mañana', sub: 'agendada' },
          { label: 'Visits', value: 24, sub: 'completadas' },
          { label: 'Rating', value: '4.9', sub: '18 valoraciones' },
        ]}
      />

      <ToolGrid>
        <ToolCard
          href="#"
          icon={ListChecks}
          title="Mis limpiezas"
          subtitle="3 próximas"
          accent="brand"
        />
        <ToolCard
          href="#"
          icon={MessageCircle}
          title="Mensajes"
          subtitle="2 sin leer"
          accent="emerald"
        />
        <ToolCard
          href="#"
          icon={Star}
          title="Valoraciones"
          subtitle="Media 4.9 ★"
          accent="amber"
        />
        <ToolCard
          href="#"
          icon={Gift}
          title="Refer & Earn"
          subtitle="Invita y gana"
          accent="rose"
        />
        <ToolCard
          href="#"
          icon={CalendarDays}
          title="Agenda"
          subtitle="Próximas visitas"
          accent="navy"
        />
        <ToolCard
          href="#"
          icon={Sparkles}
          title="Historial"
          subtitle="24 limpiezas"
          accent="brand"
        />
      </ToolGrid>

      <CorporateBanner
        href="#"
        eyebrow="Tu cleaning hub"
        title="Mensajes · Valoraciones · Referidos"
        subtitle="Todo lo que necesitas con tu equipo"
      />
    </ClientShell>
  );
}
