import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type Kind = 'properties' | 'cleaners' | 'tasks';

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return '';
    const s = typeof v === 'string' ? v : JSON.stringify(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const url = new URL(req.url);
  const kind = (url.searchParams.get('kind') ?? 'properties') as Kind;

  let rows: Record<string, unknown>[] = [];

  if (kind === 'properties') {
    const { data } = await supabase
      .from('properties')
      .select('id, name, address, airbnb_ical_url, notes, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    rows = data ?? [];
  } else if (kind === 'cleaners') {
    const { data } = await supabase
      .from('cleaners')
      .select('id, name, phone, email, pin, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    rows = data ?? [];
  } else if (kind === 'tasks') {
    const { data } = await supabase
      .from('tasks')
      .select(
        'id, scheduled_for, status, notes, photo_url, checked_in_at, checked_in_lat, checked_in_lng, completed_at, property_id, cleaner_id, created_at',
      )
      .eq('owner_id', user.id)
      .order('scheduled_for', { ascending: false });
    rows = data ?? [];
  } else {
    return new NextResponse('Unknown export kind', { status: 400 });
  }

  const csv = toCsv(rows);
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${kind}-${date}.csv"`,
    },
  });
}
