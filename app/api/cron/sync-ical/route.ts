import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { parseIcsCheckoutDates } from '@/lib/ical';

// Daily cron: sync every property's iCal feed and auto-create turnover tasks.
// Configured in vercel.json. Vercel adds the Authorization header automatically
// if CRON_SECRET env var is set.
//
// As of migration 0037 the source column is `properties.ical_url` (was
// `airbnb_ical_url`) and we now stamp `properties.ical_last_sync_at` after
// each successful pull so the UI can render "última sincronización: hace X min".

export const dynamic = 'force-dynamic';

type PropertyRow = {
  id: string;
  owner_id: string;
  ical_url: string | null;
};

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const admin = createAdminClient();

  // Read properties using the new ical_url column. If migration 0037 hasn't
  // been applied yet we get a "column does not exist" error — log a warning
  // and exit gracefully instead of 500-ing the cron.
  const { data: properties, error: selectErr } = await admin
    .from('properties')
    .select('id, owner_id, ical_url')
    .not('ical_url', 'is', null);

  if (selectErr) {
    if (/ical_url/i.test(selectErr.message)) {
      console.warn(
        '[cron/sync-ical] properties.ical_url column missing — has migration 0037 been applied? Skipping run.',
        selectErr.message,
      );
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: 'ical_url column missing (apply migration 0037)',
      });
    }
    return NextResponse.json({ error: selectErr.message }, { status: 500 });
  }

  const summary: { propertyId: string; added: number; error?: string }[] = [];

  for (const p of (properties ?? []) as PropertyRow[]) {
    if (!p.ical_url) continue;
    try {
      const res = await fetch(p.ical_url, {
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

      let added = 0;
      if (future.length > 0) {
        const { data: existing } = await admin
          .from('tasks')
          .select('scheduled_for')
          .eq('property_id', p.id)
          .in('scheduled_for', future);

        const existingSet = new Set(
          (existing ?? []).map((t) => t.scheduled_for),
        );
        const toCreate = future.filter((d) => !existingSet.has(d));

        if (toCreate.length > 0) {
          const rows = toCreate.map((d) => ({
            owner_id: p.owner_id,
            property_id: p.id,
            scheduled_for: d,
            required_photos: 4,
            notes: 'Auto-created from iCal sync (daily)',
          }));
          await admin.from('tasks').insert(rows);
          added = toCreate.length;
        }
      }

      // Stamp last sync timestamp regardless of how many tasks were added —
      // a successful pull with zero new checkouts is still a successful sync.
      await admin
        .from('properties')
        .update({ ical_last_sync_at: new Date().toISOString() })
        .eq('id', p.id);

      summary.push({ propertyId: p.id, added });
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
