// lib/token.ts — Edge-compatible, no Node.js Buffer

function toBase64Url(bytes: ArrayBuffer): string {
  return btoa(Array.from(new Uint8Array(bytes), (b) => String.fromCharCode(b)).join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function fromBase64Url(str: string): ArrayBuffer {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}

async function importKey(usage: KeyUsage) {
  const secret = process.env.STUDIO_SECRET;
  if (!secret) throw new Error('STUDIO_SECRET env var is not set');
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage],
  );
}

export async function sign(payload: object): Promise<string> {
  const data = JSON.stringify(payload);
  const key = await importKey('sign');
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const envelope = JSON.stringify({ data, sig: toBase64Url(sig) });
  return toBase64Url(new TextEncoder().encode(envelope).buffer as ArrayBuffer);
}

export async function verify(token: string): Promise<{ user: string } | null> {
  try {
    const envelope = new TextDecoder().decode(fromBase64Url(token));
    const { data, sig: sigB64 } = JSON.parse(envelope) as { data: string; sig: string };
    const key = await importKey('verify');
    const sigBytes = fromBase64Url(sigB64);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(data),
    );
    if (!valid) return null;
    const payload = JSON.parse(data) as { user: string; exp: number };
    if (payload.exp < Date.now()) return null;
    return { user: payload.user };
  } catch {
    return null;
  }
}