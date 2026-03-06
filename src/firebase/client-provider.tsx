'use client';

/**
 * @fileOverview Proveedor de cliente para asegurar inicialización única y síncrona.
 */

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './init';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  // Inicialización síncrona para evitar errores de Promise durante el build
  const firebaseServices = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
