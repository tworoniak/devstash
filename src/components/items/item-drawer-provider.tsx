'use client';

import { createContext, useContext, useState } from 'react';
import { ItemDrawer } from './item-drawer';

interface ItemDrawerContextValue {
  openDrawer: (itemId: string) => void;
}

const ItemDrawerContext = createContext<ItemDrawerContextValue | null>(null);

export function useItemDrawer() {
  const ctx = useContext(ItemDrawerContext);
  if (!ctx) throw new Error('useItemDrawer must be used within ItemDrawerProvider');
  return ctx;
}

export function ItemDrawerProvider({ children }: { children: React.ReactNode }) {
  const [itemId, setItemId] = useState<string | null>(null);

  return (
    <ItemDrawerContext.Provider value={{ openDrawer: setItemId }}>
      {children}
      <ItemDrawer itemId={itemId} onClose={() => setItemId(null)} />
    </ItemDrawerContext.Provider>
  );
}
