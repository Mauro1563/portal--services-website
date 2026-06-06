import { redirect } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  Building2,
  CalendarDays,
  CreditCard,
  ListChecks,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  Users,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getOwnerProfile, displayNameFrom } from '@/lib/owner-profile';
import { signout } from '@/app/login/actions';
import {
  CorporateBanner,
  PortalHero,
  PortalShell,
  StatRow,
  ToolCard,
  ToolGrid,
} from '@/components/portal/PortalDashboardShell';

export default async function OwnerHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?role=owner');

  const today = new Date().toISOString().split('T')[0];

  const [propsRes, cleanersRes, todayRes, pendingRes] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase
      .from('cleaners')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('scheduled_for', today),
    supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .gte('scheduled_for', today)
      .neq('status', 'completed')
      .neq('status', 'cancelled'),
  ]);

  const propertiesCount = propsRes.count ?? 0;
  const cleanersCount = cleanersRes.count ?? 0;
  const todayCount = todayRes.count ?? 0;
  const pendingCount = pendingRes.count ?? 0;

  if (propertiesCount === 0 && cleanersCount === 0) {
    redirect('/owner/onboarding');
  }

  const profile = await getOwnerProfile(user.id);
  const fullName = displayNameFrom(profile, user.email ?? null) ?? 'Owner';
  const firstName = fullName.split(/\s+/)[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const isDay = hour < 18;

  return (
    <PortalShell
      badge={{ label: 'Owner portal', icon: Briefcase }}
      rightSlot={
        <form action={signout}>
          <button
            type="submit"
            className="text-[11px] font-semibold text-text-3 hover:text-text-1"
          >
            Sign out
          </button>
        </form>
      }
    >
      <PortalHero
        portalLabel="Owner portal"
        portalIcon={Briefcase}
        topRightChip={{ label: isDay ? 'Day' : 'Night', icon: isDay ? Sun : Moon }}
        greeting={greeting}
        displayName={firstName}
        chips={[
          {
            kind: 'text',
            label: profile?.business_name ?? 'Your business',
            icon: Building2,
          },
          { kind: 'status', status: 'online', label: 'online' },
        ]}
      />

      <StatRow
        items={[
          { label: 'Today', value: todayCount, sub: 'cleanings' },
          { label: 'Pending', value: pendingCount, sub: 'to complete' },
          { label: 'Team', value: cleanersCount, sub: 'cleaners' },
        ]}
      />

      <ToolGrid>
        <ToolCard
          href="/owner/tasks"
          icon={ListChecks}
          title="Cleanings"
          subtitle={`${todayCount} today`}
          accent="brand"
        />
        <ToolCard
          href="/owner/properties"
          icon={Building2}
          title="Properties"
          subtitle={`${propertiesCount} total`}
          accent="emerald"
        />
        <ToolCard
          href="/owner/cleaners"
          icon={Users}
          title="Cleaners"
          subtitle={`${cleanersCount} team`}
          accent="amber"
        />
        <ToolCard
          href="/owner/clients"
          icon={MessageSquare}
          title="Clients"
          subtitle="Communication"
          accent="navy"
        />
        <ToolCard
          href="/owner/calendar"
          icon={CalendarDays}
          title="Calendar"
          subtitle="Schedule view"
          accent="brand"
        />
        <ToolCard
          href="/owner/analytics"
          icon={BarChart3}
          title="Analytics"
          subtitle="Ops dashboard"
          accent="emerald"
        />
        <ToolCard
          href="/owner/billing"
          icon={CreditCard}
          title="Billing"
          subtitle="Plan & invoices"
          accent="rose"
        />
        <ToolCard
          href="/owner/settings"
          icon={Settings}
          title="Settings"
          subtitle="Business profile"
          accent="navy"
        />
      </ToolGrid>

      <CorporateBanner
        href="/owner/analytics"
        eyebrow="Live operations"
        title="Today's run-rate · Team status"
        subtitle="Real-time view of jobs, cleaners and map"
      />
    </PortalShell>
  );
}
