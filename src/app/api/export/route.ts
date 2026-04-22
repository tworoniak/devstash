import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserExportData } from '@/lib/db/export';
import { r2Get } from '@/lib/r2-api';
import { zipSync } from 'fflate';
import { sanitizeFilename } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const format = request.nextUrl.searchParams.get('format') ?? 'json';
  const date = new Date().toISOString().split('T')[0];
  const data = await getUserExportData(session.user.id);

  if (format === 'zip') {
    const jsonBytes = new TextEncoder().encode(JSON.stringify(data, null, 2));
    const files: Record<string, Uint8Array> = {
      'devstash-export.json': jsonBytes,
    };

    const fileItems = data.items.filter((item) => item.fileUrl && item.fileName);
    await Promise.all(
      fileItems.map(async (item) => {
        try {
          const { body } = await r2Get(item.fileUrl!);
          files[`files/${sanitizeFilename(item.fileName!)}`] = new Uint8Array(body);
        } catch {
          // Skip files that can't be fetched from storage
        }
      })
    );

    const zip = Buffer.from(zipSync(files));
    return new NextResponse(zip, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="devstash-export-${date}.zip"`,
      },
    });
  }

  // JSON export — strip fileUrl from items (metadata only, no storage keys)
  const exportData = {
    ...data,
    items: data.items.map(({ fileUrl: _fileUrl, ...rest }) => rest),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="devstash-export-${date}.json"`,
    },
  });
}
