import type { Firestore } from 'firebase/firestore';

/**
 * @fileOverview Tenant Resolver.
 * Uses dynamic imports for implementation to ensure SSR safety.
 */
export class TenantManager {
  static async resolveTenant(userId: string, db: Firestore) {
    const { doc, getDoc } = await import('firebase/firestore');
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return {
          id: userData.tenantId || 'default-tenant',
          name: userData.tenantName || 'Crushome Default',
          plan: userData.plan || 'free'
        };
      }
      
      console.warn(`[CORE] User document not found for userId: ${userId}. Falling back to default tenant.`);
      return {
        id: 'default-tenant',
        name: 'Crushome Default',
        plan: 'free'
      };

    } catch (error) {
      console.error('Error resolving tenant:', error);
      return {
        id: 'default-tenant',
        name: 'Crushome Default',
        plan: 'free'
      };
    }
  }

  static getStoragePath(tenantId: string, path: string): string {
    return `tenants/${tenantId}/${path}`;
  }
}
