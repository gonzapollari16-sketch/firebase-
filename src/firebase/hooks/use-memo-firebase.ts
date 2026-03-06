
'use client';

import { useMemo } from 'react';

/**
 * useMemoFirebase
 * Hook personalizado para memorizar referencias o queries de Firebase.
 * Incluye casting de tipos para evitar errores de intersección.
 */
export function useMemoFirebase<T>(factory: () => T, deps: any[]): T & { __memo?: boolean } {
  return useMemo(() => {
    const val = factory();
    if (val && typeof val === 'object') {
      (val as any).__memo = true;
    }
    return val as T & { __memo?: boolean };
  }, deps);
}
