/**
 * @fileOverview Gestor de Asientos (Seat Manager) Consolidado.
 * Implementa Shadow Users, Pool Users y límites de equipo organizacional.
 * Saneado de correos electrónicos hardcoded.
 */

import type { UserType, SubscriptionPlan } from '@/lib/types';

export const SeatManager = {
  /**
   * Determina si un tipo de usuario consume una licencia permanente.
   */
  consumesSeat(type: UserType): boolean {
    return type === 'normal' || type === 'pool';
  },

  /**
   * Verifica disponibilidad de cupo para un nuevo usuario.
   */
  checkAvailability(tenant: any, userEmail: string, type: UserType) {
    // 1. Usuarios Shadow nunca bloquean por cupo
    if (type === 'shadow') return { allowed: true };

    // 2. Regla de Equipo del Sistema (Dominios de infraestructura)
    const isCoreTeam = userEmail.endsWith('@crushome.ai') || userEmail.endsWith('@crushome.com');
    if (isCoreTeam) {
      const currentCount = tenant.seatsUsed || 0;
      if (currentCount >= 30) {
        return { allowed: false, reason: 'Límite de equipo interno alcanzado.' };
      }
      return { allowed: true };
    }

    // 3. Verificación de cupo estándar del Tenant
    const totalCupo = (tenant.seatsIncluded || 0) + (tenant.seatsExtra || 0);
    if (tenant.seatsUsed >= totalCupo) {
      return { 
        allowed: false, 
        reason: 'Límite de asientos alcanzado.', 
        needsUpgrade: true,
        pricePerExtra: 25 // USD
      };
    }

    return { allowed: true };
  },

  /**
   * Calcula expiración para asientos de pool.
   */
  calculatePoolExpiration(hours: number): Date {
    return new Date(Date.now() + hours * 3600 * 1000);
  }
};
