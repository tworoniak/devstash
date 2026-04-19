/**
 * Cloudflare REST API helpers for R2 object storage.
 *
 * Used instead of the S3-compatible endpoint because the S3 endpoint
 * (*.r2.cloudflarestorage.com) has TLS handshake issues in some Node.js
 * environments. The REST API (api.cloudflare.com) is always reachable.
 */

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const BUCKET = process.env.R2_BUCKET_NAME!;
const TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

function objectUrl(key: string): string {
  return `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects/${key}`;
}

export async function r2Put(key: string, body: Buffer, contentType: string): Promise<void> {
  const res = await fetch(objectUrl(key), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': contentType,
    },
    body: new Uint8Array(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`R2 PUT failed (${res.status}): ${text}`);
  }
}

export async function r2Get(key: string): Promise<{ body: Buffer; contentType: string }> {
  const res = await fetch(objectUrl(key), {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`R2 GET failed (${res.status}): ${text}`);
  }

  const contentType = res.headers.get('Content-Type') ?? 'application/octet-stream';
  const arrayBuffer = await res.arrayBuffer();
  return { body: Buffer.from(arrayBuffer), contentType };
}

export async function r2Delete(key: string): Promise<void> {
  const res = await fetch(objectUrl(key), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => '');
    throw new Error(`R2 DELETE failed (${res.status}): ${text}`);
  }
}
