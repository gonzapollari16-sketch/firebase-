/**
 * @fileOverview Gestión de Invitaciones (Admin SDK Modular).
 */

import { getAdminAuth, getAdminDb } from '@/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { addUserToTenantClaims } from './auth-admin.service';

export async function createInvitation(data: {
  tenantId: string;
  email: string;
  role: 'AGENT' | 'USER';
  invitedBy: string;
}) {
  const adminDb = getAdminDb();
  const inviteId = Math.random().toString(36).substring(2, 15);
  const inviteRef = adminDb.collection('tenants').doc(data.tenantId).collection('invitations').doc(inviteId);
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await inviteRef.set({
    email: data.email.toLowerCase(),
    role: data.role,
    invitedBy: data.invitedBy,
    createdAt: FieldValue.serverTimestamp(),
    expiresAt: expiresAt.toISOString(),
    status: 'pending'
  });

  return { inviteId };
}

export async function acceptInvitation(idToken: string, tenantId: string, inviteId: string) {
  const adminAuth = getAdminAuth();
  const adminDb = getAdminDb();
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  const uid = decodedToken.uid;
  const email = decodedToken.email!.toLowerCase();

  const inviteRef = adminDb.collection('tenants').doc(tenantId).collection('invitations').doc(inviteId);
  const tenantRef = adminDb.collection('tenants').doc(tenantId);

  return await adminDb.runTransaction(async (transaction) => {
    const inviteSnap = await transaction.get(inviteRef);
    const tenantSnap = await transaction.get(tenantRef);

    if (!inviteSnap.exists) throw new Error('Invitación no encontrada.');
    const invite = inviteSnap.data()!;

    if (invite.status !== 'pending') throw new Error('Invitación ya procesada.');
    if (invite.email !== email) throw new Error('Esta invitación no pertenece a tu cuenta.');
    
    const tenantData = tenantSnap.data()!;
    if (tenantData.verifiedDomains && tenantData.verifiedDomains.length > 0) {
      const userDomain = email.split('@')[1];
      if (!tenantData.verifiedDomains.includes(userDomain)) {
        throw new Error('Dominio no autorizado.');
      }
    }

    const userRef = tenantRef.collection('users').doc(uid);
    transaction.set(userRef, {
      id: uid,
      email: email,
      role: invite.role,
      tenantId: tenantId,
      status: 'active',
      createdAt: FieldValue.serverTimestamp()
    });

    transaction.update(inviteRef, { status: 'accepted', acceptedAt: FieldValue.serverTimestamp() });
    await addUserToTenantClaims(uid, tenantId, invite.role);

    return { success: true };
  });
}
