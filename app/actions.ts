'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSession, clearSession, getSession } from '@/lib/session';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function login(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const user = String(formData.get('user') ?? 'stephen').trim().toLowerCase();

  if (password !== process.env.STUDIO_PASSWORD) {
    redirect('/login?error=1');
  }

  await createSession(user);
  redirect('/');
}

export async function logout() {
  await clearSession();
  redirect('/login');
}

// ── Entries ───────────────────────────────────────────────────────────────────

export async function saveEntry(formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/login');

  const key = String(formData.get('key') ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  const type = String(formData.get('type') ?? '').trim();
  const tagsRaw = String(formData.get('tags') ?? '').trim();
  const tags = tagsRaw
    ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  if (!key || !title || !body || !type) {
    redirect('/?error=missing-fields');
  }

  const { error } = await supabaseAdmin.from('context_entries').upsert(
    {
      key,
      title,
      body,
      type,
      tags,
      status: 'active',
      updated_by: session.user,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' },
  );

  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);

  revalidatePath('/');
  redirect('/');
}

export async function archiveEntry(formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/login');

  const key = String(formData.get('key') ?? '');

  const { error } = await supabaseAdmin
    .from('context_entries')
    .update({
      status: 'archived',
      updated_by: session.user,
      updated_at: new Date().toISOString(),
    })
    .eq('key', key);

  if (error) throw new Error(`Archive failed: ${error.message}`);

  revalidatePath('/');
  redirect('/');
}

export async function restoreEntry(formData: FormData) {
  const session = await getSession();
  if (!session) redirect('/login');

  const key = String(formData.get('key') ?? '');

  const { error } = await supabaseAdmin
    .from('context_entries')
    .update({
      status: 'active',
      updated_by: session.user,
      updated_at: new Date().toISOString(),
    })
    .eq('key', key);

  if (error) throw new Error(`Restore failed: ${error.message}`);

  revalidatePath('/');
  redirect('/');
}
