'use client';

import { useMemo } from 'react';
import { useGlobalStore } from './state/global-store';
import { RBACEngine } from './rbac/rbac-engine';
import { moduleRegistry } from './module-registry';
import { eventBus } from './event-bus/event-bus';
import { createApiClient } from './api-gateway/client';

/**
 * @fileOverview Hook Maestro useCore Consolidado.
 * Orquesta el acceso a la identidad, permisos y herramientas del sistema.
 */
export function useCore() {
  const store = useGlobalStore();
  const { 
    user, 
    profile, 
    tenant, 
    role, 
    plan, 
    cognitive,
    worldModel,
    experienceLogs,
    learningRecords,
    systemStatus,
    impersonatingUser
  } = store;

  // Memoize API Client to ensure it stays in the browser and remains stable
  const apiClient = useMemo(() => createApiClient(), []);

  const effectiveRole = impersonatingUser ? impersonatingUser.role : role;
  const effectivePlan = impersonatingUser ? impersonatingUser.plan : plan;

  const isOwnerRoot = RBACEngine.isRoot(user?.email);

  const hasPermission = (permission: string) => {
    if (isOwnerRoot) return true;
    return RBACEngine.can(effectiveRole, permission);
  };

  const hasFeature = (featureKey: string) => {
    if (isOwnerRoot || effectivePlan === 'ENTERPRISE') return true;
    return RBACEngine.isFeatureEnabled(effectivePlan, featureKey);
  };

  const getActiveModules = () => {
    return moduleRegistry.getAll().filter(m => hasFeature(m.featureKey));
  };

  return {
    // Identity Layer
    user,
    profile,
    tenant,
    role: effectiveRole,
    plan: effectivePlan,
    isOwnerRoot,
    isImpersonating: !!impersonatingUser,
    
    // Auth & Permission Services
    hasPermission,
    hasFeature,
    modules: getActiveModules(),
    
    // Core Infrastructure Tools
    eventBus,
    apiClient,
    
    // Cognitive Core Metrics
    cognitive,
    worldModel,
    experienceLogs,
    learningRecords,
    
    // System Status Plane
    systemStatus,
    
    // Low-level Store Access
    _store: useGlobalStore
  };
}
