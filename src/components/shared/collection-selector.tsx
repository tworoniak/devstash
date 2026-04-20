'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Collection {
  id: string;
  name: string;
}

interface CollectionSelectorProps {
  collections: Collection[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function CollectionSelector({ collections, selected, onChange }: CollectionSelectorProps) {
  if (collections.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No collections yet. Create one first.
      </p>
    );
  }

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="max-h-36 overflow-y-auto rounded-md border border-input bg-background p-2 space-y-1.5">
      {collections.map((col) => (
        <div key={col.id} className="flex items-center gap-2">
          <Checkbox
            id={`col-${col.id}`}
            checked={selected.includes(col.id)}
            onCheckedChange={() => toggle(col.id)}
          />
          <Label
            htmlFor={`col-${col.id}`}
            className="text-sm font-normal cursor-pointer"
          >
            {col.name}
          </Label>
        </div>
      ))}
    </div>
  );
}
