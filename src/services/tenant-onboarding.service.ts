/**
 * @fileOverview Servicio de Onboarding Multi-tenant.
 * Servidor-only: Usa Firebase Admin SDK modular.
 */

import { adminAuth, adminDb } from '@/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { addUserToTenantClaims } from './auth-admin.service';

export async function onboardUser(data: {
  idToken: string;
  organizationName: string;
}) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(data.idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email!;

    const userSearch = await adminDb.collectionGroup('users').where('email', '==', email).limit(1).get();
    
    if (!userSearch.empty) {
      const existingUserDoc = userSearch.docs[0];
      const existingData = existingUserDoc.data();
      const existingTenantId = existingData.tenantId;

      await addUserToTenantClaims(uid, existingTenantId, existingData.role || 'OWNER');
      return { success: true, tenantId: existingTenantId, repaired: true };
    }

    const nameSlug = data.organizationName.toLowerCase().trim().replace(/[^\w-]+/g, '-');
    const tenantId = `${nameSlug}-${uid.substring(0, 6)}`;

    const tenantRef = adminDb.collection('tenants').doc(tenantId);
    const userRef = tenantRef.collection('users').doc(uid);

    await adminDb.runTransaction(async (transaction) => {
      const tenantSnap = await transaction.get(tenantRef);

      if (!tenantSnap.exists) {
        transaction.set(tenantRef, {
          name: data.organizationName,
          plan: 'FREE',
          seatsMax: 5,
          seatsUsed: 1,
          icp: 75,
          createdAt: FieldValue.serverTimestamp(),
          createdBy: uid,
          status: 'active',
          verifiedDomains: []
        });
      }

      transaction.set(userRef, {
        id: uid,
        email: email,
        role: 'OWNER',
        tenantId: tenantId,
        status: 'active',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    });

    await addUserToTenantClaims(uid, tenantId, 'OWNER');

    return { success: true, tenantId };

  } catch (error: any) {
    console.error('[ONBOARDING_ERROR]', error);
    return { success: false, error: error.message };
  }
}
