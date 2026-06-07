/**
 * Public, no-auth preview of the Owner dashboard with mock data. Linked
 * from /hq/vistas so you can see exactly what an owner sees after login
 * without needing to be one.
 */
import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarDays,
  CreditCard,
  ListChecks,
  MessageSquare,
  Settings,
  Sun,
  Users,
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
  title: 'Vista previa · Portal del Owner',
  robots: { index: false, follow: false },
};

export default function OwnerPreview() {
  return (
    <PortalShell badge={{ label: 'Owner portal', icon: Briefcase }}>
      <PortalHero
        portalLabel="Owner portal"
        portalIcon={Briefcase}
        topRightChip={{ label: 'Day', icon: Sun }}
        greeting="Good afternoon"
        displayName="María"
        chips={[
          { kind: 'text', label: 'Limpiezas Premium', icon: Building2 },
          { kind: 'status', status: 'online', label: 'online' },
        ]}
      />

      <StatRow
        items={[
          { label: 'Today', value: 12, sub: 'cleanings' },
          { label: 'Pending', value: 3, sub: 'to complete' },
          { label: 'Team', value: 8, sub: 'cleaners' },
        ]}
      />

      <ToolGrid>
        <ToolCard href="#" icon={ListChecks} title="Cleanings" subtitle="12 today" accent="brand" />
        <ToolCard href="#" icon={Building2} title="Properties" subtitle="24 total" accent="emerald" />
        <ToolCard href="#" icon={Users} title="Cleaners" subtitle="8 team" accent="amber" />
        <ToolCard href="#" icon={MessageSquare} title="Clients" subtitle="Communication" accent="navy" />
        <ToolCard href="#" icon={CalendarDays} title="Calendar" subtitle="Schedule view" accent="brand" />
        <ToolCard href="#" icon={BarChart3} title="Analytics" subtitle="Ops dashboard" accent="emerald" />
        <ToolCard href="#" icon={CreditCard} title="Billing" subtitle="Plan & invoices" accent="rose" />
        <ToolCard href="#" icon={Settings} title="Settings" subtitle="Business profile" accent="navy" />
      </ToolGrid>

      <CorporateBanner
        href="#"
        eyebrow="Live operations"
        title="Today's run-rate · Team status"
        subtitle="Real-time view of jobs, cleaners and map"
      />
    </PortalShell>
  );
}
