import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { r2Get } from '@/lib/r2-api';
import { getItemById } from '@/lib/db/items';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const item = await getItemById(id, session.user.id);

  if (!item || !item.fileUrl) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: Buffer;
  let contentType: string;
  try {
    ({ body, contentType } = await r2Get(item.fileUrl));
  } catch {
    return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });
  }

  const filename = item.fileName ?? 'download';

  return new NextResponse(new Uint8Array(body), {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(body.length),
    },
  });
}
