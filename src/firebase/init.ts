
'use client';

/**
 * @fileOverview Inicialización síncrona para el proveedor de cliente.
 */

import { getClientApp, getClientAuth, getClientDb } from './client';

export function initializeFirebase() {
  const firebaseApp = getClientApp();
  const auth = getClientAuth();
  const firestore = getClientDb();

  return {
    firebaseApp,
    auth,
    firestore
  };
}
