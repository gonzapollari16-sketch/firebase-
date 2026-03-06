"use server";

import { onboardUser } from '@/services/tenant-onboarding.service';

/**
 * @fileOverview UI-facing Server Actions.
 * Isolated from AI dependencies to prevent module graph pollution in Client Components.
 */

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export async function executeOnboarding(payload: { 
  idToken: string;
  orgName: string;
}): Promise<ActionResponse> {
  try {
    const result = await onboardUser({
      idToken: payload.idToken,
      organizationName: payload.orgName
    });
    
    if (!result || !result.success) {
      return { success: false, error: result?.error || 'No se pudo completar el onboarding' };
    }

    return { success: true, data: result.tenantId };
  } catch (err: any) {
    console.error('[ACTION:ONBOARDING] Fail:', err);
    return { success: false, error: 'Error inesperado durante el onboarding' };
  }
}

export async function bootstrapUserTenant(payload: { idToken: string }): Promise<ActionResponse> {
  try {
    const result = await onboardUser({
      idToken: payload.idToken,
      organizationName: "Mi Organización"
    });

    if (!result || !result.success) {
      return { success: false, error: result?.error || 'No se pudo inicializar la organización' };
    }

    return { success: true, data: result.tenantId };
  } catch (err: any) {
    console.error('[ACTION:BOOTSTRAP] Fail:', err);
    return { success: false, error: 'Falla crítica en el sistema de auto-reparación' };
  }
}
