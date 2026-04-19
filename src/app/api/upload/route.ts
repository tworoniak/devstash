import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { r2Put } from '@/lib/r2-api';

// Allowed extensions per type — source of truth for validation.
// MIME type check is unreliable: macOS reports .md as text/plain or text/x-markdown,
// .toml and .ini often come through as empty string, etc.
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']);
const FILE_EXTENSIONS = new Set(['pdf', 'txt', 'md', 'json', 'yaml', 'yml', 'xml', 'csv', 'toml', 'ini']);

// MIME type used as a secondary sanity check for images (strong signal).
// For files we skip the MIME check entirely and trust the extension.
const IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;   // 5 MB
const MAX_FILE_BYTES = 10 * 1024 * 1024;   // 10 MB

function getExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const itemType = formData.get('type') as string | null; // 'file' | 'image'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const isImage = itemType === 'image';
  const ext = getExtension(file.name);
  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_FILE_BYTES;

  if (isImage) {
    // For images: check both extension and MIME type
    if (!IMAGE_EXTENSIONS.has(ext) && !IMAGE_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'File type not allowed. Use PNG, JPG, GIF, WebP, or SVG.' }, { status: 400 });
    }
  } else {
    // For files: extension is the authority — MIME types are too inconsistent
    if (!FILE_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'File type not allowed. Use PDF, TXT, MD, JSON, YAML, XML, CSV, TOML, or INI.' },
        { status: 400 }
      );
    }
  }

  if (file.size > maxBytes) {
    const limit = isImage ? '5 MB' : '10 MB';
    return NextResponse.json({ error: `File too large. Maximum size is ${limit}.` }, { status: 400 });
  }

  // Use the browser-reported MIME type if available, fall back to a safe default
  const contentType = file.type || 'application/octet-stream';

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `uploads/${session.user.id}/${crypto.randomUUID()}${ext ? `.${ext}` : ''}`;

  try {
    await r2Put(key, buffer, contentType);
  } catch (err) {
    console.error('[upload] R2 PUT failed:', err);
    return NextResponse.json({ error: 'Storage upload failed' }, { status: 500 });
  }

  return NextResponse.json({
    key,
    url: `${process.env.R2_PUBLIC_URL}/${key}`,
    fileName: file.name,
    fileSize: file.size,
    mimeType: contentType,
  });
}
