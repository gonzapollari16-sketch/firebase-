'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useUser, useFirestore } from '@/firebase/provider';
import { useGlobalStore } from './state/global-store';
import { eventBus } from './event-bus/event-bus';
import { RBACEngine } from './rbac/rbac-engine';
import { AutomationEngine } from './automations/automation-engine';
import { GrowthEngine } from './growth-engine/growth-engine';
import { CognitiveCore } from './cognitive/cognitive-core';
import { bootstrapUserTenant } from '@/app/actions';
import type { ActionResponse } from '@/app/actions';

/**
 * @fileOverview CoreInitializer - Sistema de Sincronización de Contexto Seguro.
 * Refactorizado para evitar race conditions y asegurar que el "brain" del sistema
 * esté listo antes de permitir la interacción.
 */
export const CoreInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  const setUser = useGlobalStore(state => state.setUser);
  const reset = useGlobalStore(state => state.reset);
  const hydrateFromFirestore = useGlobalStore(state => state.hydrateFromFirestore);
  const setPermissions = useGlobalStore(state => state.setPermissions);
  const setGlobalLoading = useGlobalStore(state => state.setGlobalLoading);
  const setSystemStatus = useGlobalStore(state => state.setSystemStatus);

  const coreInitialized = useRef(false);
  const syncActive = useRef(false);

  useEffect(() => {
    // 1. Inicializar motores estáticos del Core solo una vez
    if (!coreInitialized.current && typeof window !== 'undefined') {
      try {
        AutomationEngine.init();
        GrowthEngine.init();
        CognitiveCore.init();
        coreInitialized.current = true;
      } catch (err) {
        console.error("[CORE] Critical initialization failure:", err);
      }
    }

    // 2. Manejo de estado Desautenticado
    if (!user) {
      if (!isUserLoading) {
        reset();
        setGlobalLoading(false);
        setSystemStatus('online');
      }
      return;
    }

    // 3. Sincronización de Identidad y Claims
    let unsubscribe: (() => void) | undefined;

    const initializeContext = async () => {
      if (!db || isBootstrapping) return;

      try {
        setGlobalLoading(true);
        
        let tokenResult = await user.getIdTokenResult();
        let tenants = tokenResult.claims.tenants as Record<string, string> || {};
        let tenantId = Object.keys(tenants)[0];

        // 4. Auto-reparación de Tenant si no existe (Self-healing system)
        if (!tenantId) {
          setIsBootstrapping(true);
          const idToken = await user.getIdToken();
          const response: ActionResponse = await bootstrapUserTenant({ idToken });

          if (response.success) {
            await user.getIdToken(true);
            tokenResult = await user.getIdTokenResult();
            tenants = tokenResult.claims.tenants as Record<string, string> || {};
            tenantId = Object.keys(tenants)[0];
          }
          setIsBootstrapping(false);
        }

        if (!tenantId) {
          console.warn("[CORE] Degraded state: Tenant identification failed.");
          setSystemStatus('degraded');
          setGlobalLoading(false);
          return;
        }

        // 5. Configurar RBAC y Sincronización en tiempo real
        const role = tenants[tenantId] || 'USER';
        setPermissions(RBACEngine.getPermissions(role));
        setUser(user);

        const { doc, onSnapshot } = await import('firebase/firestore');
        const userRef = doc(db, 'tenants', tenantId, 'users', user.uid);
        
        unsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            hydrateFromFirestore({ ...snapshot.data(), tenantId });
          }
          if (!syncActive.current) {
            eventBus.emit('auth.state_changed', { user, tenantId, role });
            syncActive.current = true;
          }
          setSystemStatus('online');
          setGlobalLoading(false);
        }, (err) => {
          console.error("[CORE] Firestore sync error:", err);
          setSystemStatus('degraded');
          setGlobalLoading(false);
        });

      } catch (err) {
        console.error("[CORE] Fatal context error:", err);
        setGlobalLoading(false);
      }
    };

    initializeContext();

    return () => {
      if (unsubscribe) unsubscribe();
      syncActive.current = false;
    };
  }, [user, isUserLoading, db, isBootstrapping, reset, setUser, setPermissions, setGlobalLoading, setSystemStatus, hydrateFromFirestore]);

  return <>{children}</>;
};
