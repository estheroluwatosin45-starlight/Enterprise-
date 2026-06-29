'use client';

import { useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';

export function StoreInitializer() {
  const initializeStore = useAdminStore((state) => state.initializeStore);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return null;
}
