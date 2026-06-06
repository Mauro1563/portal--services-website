import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { parseIcsCheckoutDates } from '@/lib/ical';

// Daily cron: sync every property's Airbnb iCal and auto-create cleaning tasks.
// Configured in vercel.json. Vercel adds the Authorization header automatically
// if CRON_SECRET env var is set.

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const admin = createAdminClient();
  const { data: properties } = await admin
    .from('properties')
    .select('id, owner_id, airbnb_ical_url')
    .not('airbnb_ical_url', 'is', null);

  const summary: { propertyId: string; added: number; error?: string }[] = [];

  for (const p of properties ?? []) {
    if (!p.airbnb_ical_url) continue;
    try {
      const res = await fetch(p.airbnb_ical_url, {
        cache: 'no-store',
        headers: { 'User-Agent': 'PortalServicesDigital/1.0' },
      });
      if (!res.ok) {
        summary.push({
          propertyId: p.id,
          added: 0,
          error: `HTTP ${res.status}`,
        });
        continue;
      }
      const text = await res.text();
      const dates = parseIcsCheckoutDates(text);
      const today = new Date().toISOString().split('T')[0];
      const future = dates.filter((d) => d >= today);
      if (future.length === 0) {
        summary.push({ propertyId: p.id, added: 0 });
        continue;
      }

      const { data: existing } = await admin
        .from('tasks')
        .select('scheduled_for')
        .eq('property_id', p.id)
        .in('scheduled_for', future);

      const existingSet = new Set((existing ?? []).map((t) => t.scheduled_for));
      const toCreate = future.filter((d) => !existingSet.has(d));

      if (toCreate.length === 0) {
        summary.push({ propertyId: p.id, added: 0 });
        continue;
      }

      const rows = toCreate.map((d) => ({
        owner_id: p.owner_id,
        property_id: p.id,
        scheduled_for: d,
        notes: 'Auto-created from Airbnb iCal sync (daily)',
      }));
      await admin.from('tasks').insert(rows);
      summary.push({ propertyId: p.id, added: toCreate.length });
    } catch (e) {
      summary.push({
        propertyId: p.id,
        added: 0,
        error: (e as Error).message,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    properties: summary.length,
    summary,
  });
}
