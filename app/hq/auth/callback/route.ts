import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/hq/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user?.email) {
    return NextResponse.redirect(`${origin}/hq/login?error=exchange_failed`);
  }

  // Allowlist gate — even if Supabase auth succeeds, we only let through
  // emails that are in marketing_admins.
  const admin = createAdminClient();
  const { data: row } = await admin
    .from('marketing_admins')
    .select('email')
    .eq('email', data.user.email)
    .maybeSingle();

  if (!row) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/hq/login?error=not_admin`);
  }

  return NextResponse.redirect(`${origin}/hq`);
}
