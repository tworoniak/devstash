'use client';

import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImportDialog } from './ImportDialog';

export function DataSettings() {
  const [importOpen, setImportOpen] = useState(false);

  return (
    <>
      <div className='space-y-4'>
        <div>
          <p className='text-sm text-muted-foreground'>
            Export your data or import from a previous export.
          </p>
        </div>

        <div className='space-y-3'>
          {/* Export row */}
          <div className='flex flex-wrap items-center gap-2'>
            <a href='/api/export?format=json' download>
              <Button variant='outline' size='sm' className='gap-2'>
                <Download className='size-4' />
                Export JSON
              </Button>
            </a>

            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' className='gap-2' disabled title='Pro feature'>
                <Download className='size-4' />
                Export ZIP
              </Button>
              <Badge variant='secondary' className='text-xs'>
                PRO
              </Badge>
            </div>
          </div>

          <div className='border-t border-border' />

          {/* Import row */}
          <div>
            <Button
              variant='outline'
              size='sm'
              className='gap-2'
              onClick={() => setImportOpen(true)}
            >
              <Upload className='size-4' />
              Import from JSON
            </Button>
          </div>
        </div>
      </div>

      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
