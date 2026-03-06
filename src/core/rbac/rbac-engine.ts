'use client';

import { UserRole, SubscriptionPlan } from '@/lib/types';

/**
 * @fileOverview Motor RBAC Consolidado.
 * Implementa jerarquía de roles, planes y el lóbulo frontal del sistema.
 */

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 5,
  DEV: 5,
  CEO: 4,
  OWNER: 3,
  AGENT: 2,
  MARKETING: 2,
  USER: 1
};

export const PLAN_HIERARCHY: Record<SubscriptionPlan, number> = {
  ENTERPRISE: 4,
  PREMIUM: 3,
  PRO: 2,
  STARTER: 1,
  FREE: 0
};

export const PERMISSION_MATRIX: Record<UserRole, string[]> = {
  ADMIN: ['*'],
  DEV: ['*'],
  CEO: ['*'],
  OWNER: [
    'users:manage', 
    'billing:manage', 
    'properties:manage', 
    'crm:manage', 
    'ai:config', 
    'audit:view',
    'team:manage',
    'admin:access'
  ],
  AGENT: [
    'properties:manage',
    'crm:use',
    'leads:manage',
    'whatsapp:use'
  ],
  MARKETING: [
    'ads:manage',
    'campaigns:view',
    'analytics:view'
  ],
  USER: [
    'properties:view',
    'search:ai',
    'profile:manage'
  ]
};

export const RBACEngine = {
  getPermissions(role: string): string[] {
    const normalizedRole = (role || 'USER').toUpperCase() as UserRole;
    return PERMISSION_MATRIX[normalizedRole] || PERMISSION_MATRIX['USER'];
  },

  can(role: UserRole, permission: string): boolean {
    if (role === 'ADMIN' || role === 'DEV' || role === 'CEO') return true;
    const perms = PERMISSION_MATRIX[role] || [];
    return perms.includes('*') || perms.includes(permission);
  },

  isRoot(userEmail?: string | null): boolean {
    if (!userEmail) return false;
    return userEmail.endsWith('@crushome.ai') || userEmail.endsWith('@crushome.com');
  },

  isFeatureEnabled(plan: SubscriptionPlan, feature: string): boolean {
    const featureMap: Record<string, SubscriptionPlan> = {
      'analytics': 'PREMIUM',
      'whatsapp': 'PREMIUM',
      'crm': 'PRO',
      'map:intelligent': 'PRO',
      'api:access': 'ENTERPRISE',
      'sandbox': 'ENTERPRISE',
      'search:ai': 'STARTER'
    };

    const requiredPlan = featureMap[feature];
    if (!requiredPlan) return true;

    const currentPlanUpper = (plan || 'FREE').toUpperCase() as SubscriptionPlan;
    const requiredPlanUpper = (requiredPlan as string).toUpperCase() as SubscriptionPlan;

    return (PLAN_HIERARCHY[currentPlanUpper] || 0) >= (PLAN_HIERARCHY[requiredPlanUpper] || 0);
  }
};
