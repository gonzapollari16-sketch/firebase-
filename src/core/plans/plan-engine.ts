
import { SubscriptionPlan } from '@/lib/types';

/**
 * @fileOverview Motor de Gestión de Planes y Feature Gating.
 * Centraliza la lógica de límites y acceso. Compatible con servidor y cliente.
 */

export const PLAN_FEATURES: Record<string, SubscriptionPlan> = {
  'search:ai': 'STARTER',
  'property:upload-auto': 'PRO',
  'map:intelligent': 'PRO',
  'whatsapp:api': 'PRO',
  'ads:advanced': 'PRO',
  'syndication:portals': 'PREMIUM',
  'community:private-network': 'PRO',
  'investor:matching': 'ENTERPRISE',
  'white-label': 'ENTERPRISE'
};

export const QUOTA_LIMITS: Record<SubscriptionPlan, number> = {
  'FREE': 5,
  'STARTER': 50,
  'PRO': 500,
  'PREMIUM': 2000,
  'ENTERPRISE': 1000000
};

export class PlanEngine {
  static hierarchy: Record<SubscriptionPlan, number> = {
    'FREE': 0,
    'STARTER': 1,
    'PRO': 2,
    'PREMIUM': 3,
    'ENTERPRISE': 4
  };

  static canAccess(currentPlan: SubscriptionPlan, featureKey: string): boolean {
    const requiredPlan = PLAN_FEATURES[featureKey];
    if (!requiredPlan) return true;
    return this.hierarchy[currentPlan] >= this.hierarchy[requiredPlan];
  }

  static hasQuota(plan: SubscriptionPlan, currentUsage: number): boolean {
    return currentUsage < QUOTA_LIMITS[plan];
  }
}
