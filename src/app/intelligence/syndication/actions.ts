'use server';

/**
 * @fileOverview Server Actions para Sindicación Inmobiliaria.
 * Ejecución 100% Server-Side usando Admin SDK para máxima seguridad.
 */

import { adminDb } from '@/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export interface PortalConnection {
  id: string;
  name: string;
  status: 'connected' | 'error' | 'pending';
  health: number;
  properties: number;
  error?: string;
}

/**
 * Recupera el estado de los portales conectados para un Tenant.
 */
export async function getPortalStatus(tenantId: string): Promise<PortalConnection[]> {
  try {
    // En producción, esto consulta la sub-colección /tenants/{tenantId}/integrations
    const snapshot = await adminDb.collection('tenants').doc(tenantId).collection('integrations').get();
    
    if (snapshot.empty) {
      // Mock inicial si no hay integraciones configuradas
      return [
        { id: 'p1', name: 'Zonaprop', status: 'connected', health: 0.98, properties: 12 },
        { id: 'p2', name: 'Argenprop', status: 'connected', health: 0.95, properties: 12 },
        { id: 'p3', name: 'Mercado Libre', status: 'error', health: 0.42, properties: 8, error: 'Token expirado' }
      ];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PortalConnection[];
  } catch (error) {
    console.error('[SYNDICATION_ACTION:GET_STATUS]', error);
    return [];
  }
}

/**
 * Dispara un proceso de sincronización masiva para el Tenant.
 */
export async function runSyndication(tenantId: string) {
  try {
    const jobRef = adminDb.collection('tenants').doc(tenantId).collection('jobs').doc();
    
    await jobRef.set({
      type: 'mass_sync',
      status: 'queued',
      createdAt: FieldValue.serverTimestamp(),
      progress: 0
    });

    // Simulación de disparo de Worker asíncrono
    console.log(`[Syndication] mass_sync job ${jobRef.id} queued for tenant ${tenantId}`);

    return { success: true, jobId: jobRef.id };
  } catch (error: any) {
    console.error('[SYNDICATION_ACTION:RUN]', error);
    return { success: false, error: error.message };
  }
}
