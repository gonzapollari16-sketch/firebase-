/**
 * @fileOverview Identidad Multi-Tenant (Admin SDK).
 */

import { adminAuth } from '@/firebase/admin';

export interface TenantClaims {
  [tenantId: string]: 'ADMIN' | 'OWNER' | 'AGENT' | 'USER';
}

export async function addUserToTenantClaims(uid: string, tenantId: string, role: any) {
  const user = await adminAuth.getUser(uid);
  const currentClaims = user.customClaims || {};
  const tenants = (currentClaims.tenants as TenantClaims) || {};
  
  tenants[tenantId] = role;
  
  await adminAuth.setCustomUserClaims(uid, {
    ...currentClaims,
    tenants
  });

  return { success: true };
}

export async function removeUserFromTenantClaims(uid: string, tenantId: string) {
  const user = await adminAuth.getUser(uid);
  const currentClaims = user.customClaims || {};
  const tenants = (currentClaims.tenants as TenantClaims) || {};
  
  if (tenants[tenantId]) {
    delete tenants[tenantId];
    await adminAuth.setCustomUserClaims(uid, {
      ...currentClaims,
      tenants
    });
  }
}
