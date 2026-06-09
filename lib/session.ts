// lib/session.ts — for use in server actions and server components only
// (middleware handles cookie checking directly via request.cookies)
import { cookies } from 'next/headers';
import { sign, verify } from './token';

const COOKIE = 'studio_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function createSession(user: string): Promise<void> {
  const token = await sign({ user, exp: Date.now() + MAX_AGE * 1000 });
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<{ user: string } | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  return verify(token);
}

export async function clearSession(): Promise<void> {
  cookies().delete(COOKIE);
}
