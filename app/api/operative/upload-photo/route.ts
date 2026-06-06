import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { notifyOwnerOfCompletion } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cleanerId = cookieStore.get('cleaner_session')?.value;
  if (!cleanerId) {
    return NextResponse.redirect(new URL('/operative/login', request.url));
  }

  const formData = await request.formData();
  const taskId = (formData.get('task_id') as string)?.trim();
  const photo = formData.get('photo') as File | null;

  if (!taskId || !photo || photo.size === 0) {
    return NextResponse.redirect(new URL('/operative', request.url));
  }

  const admin = createAdminClient();

  const ext = photo.name.includes('.') ? photo.name.split('.').pop() : 'jpg';
  const filename = `${cleanerId}/${taskId}-${Date.now()}.${ext}`;
  const bytes = new Uint8Array(await photo.arrayBuffer());

  const { error: uploadErr } = await admin.storage
    .from('task-photos')
    .upload(filename, bytes, {
      contentType: photo.type || 'image/jpeg',
      upsert: false,
    });

  if (uploadErr) {
    return NextResponse.redirect(
      new URL(
        `/operative?error=${encodeURIComponent('Upload failed: ' + uploadErr.message)}`,
        request.url,
      ),
    );
  }

  const {
    data: { publicUrl },
  } = admin.storage.from('task-photos').getPublicUrl(filename);

  // Look up owner_id so we can attribute the photo row
  const { data: taskRow } = await admin
    .from('tasks')
    .select('owner_id')
    .eq('id', taskId)
    .eq('cleaner_id', cleanerId)
    .maybeSingle();

  // Append to task_photos for multi-photo history
  if (taskRow?.owner_id) {
    await admin.from('task_photos').insert({
      task_id: taskId,
      owner_id: taskRow.owner_id,
      cleaner_id: cleanerId,
      url: publicUrl,
    });
  }

  // Keep the legacy photo_url column for backwards compatibility (it's the
  // most recent photo) and mark the task completed.
  await admin
    .from('tasks')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      photo_url: publicUrl,
    })
    .eq('id', taskId)
    .eq('cleaner_id', cleanerId);

  await notifyOwnerOfCompletion(taskId);

  return NextResponse.redirect(new URL('/operative', request.url), { status: 303 });
}
