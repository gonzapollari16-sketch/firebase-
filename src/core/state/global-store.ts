import { create } from 'zustand';
import type { User } from 'firebase/auth';
import type { UserRole, SubscriptionPlan, UserType } from '@/lib/types';

/**
 * @fileOverview Global State Store (Zustand) - Unified Brain.
 * Refactorizado para usar tipos centralizados y evitar inconsistencias de build.
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: SubscriptionPlan;
  tenantId: string;
  userType: UserType;
  status: 'active' | 'invited' | 'disabled';
}

export interface Tenant {
  id: string;
  name: string;
  plan: SubscriptionPlan;
  seatsMax: number;
  seatsUsed: number;
  icp: number;
}

export interface CognitiveMetrics {
  gis: number;
  ses: number;
  msi: number;
}

export interface WorldModel {
  absorptionRate: number;
  liquidityIndex: number;
  priceElasticity: number;
  demandSurge: number;
  marketSophistication: number;
}

export interface ExperienceLog {
  id: string;
  userId: string;
  action: string;
  success: boolean;
  frictionDetected: boolean;
  economicImpact: number;
  timestamp: number;
}

interface LearningRecord {
  ts: number;
  event: string;
  impact: string;
}

interface GlobalState {
  user: User | null;
  profile: UserProfile | null;
  tenant: Tenant | null;
  role: UserRole;
  plan: SubscriptionPlan;
  permissions: string[];
  impersonatingUser: { email: string; role: UserRole; plan: SubscriptionPlan } | null;
  loading: boolean;
  systemStatus: 'online' | 'degraded' | 'maintenance';
  cognitive: CognitiveMetrics;
  worldModel: WorldModel;
  experienceLogs: ExperienceLog[];
  learningRecords: LearningRecord[];
  setUser: (user: User | null) => void;
  setPermissions: (permissions: string[]) => void;
  setGlobalLoading: (loading: boolean) => void;
  setSystemStatus: (status: 'online' | 'degraded' | 'maintenance') => void;
  setImpersonation: (user: { email: string; role: UserRole; plan: SubscriptionPlan } | null) => void;
  hydrateFromFirestore: (data: any) => void;
  reset: () => void;
  setCognitiveMetrics: (metrics: Partial<CognitiveMetrics>) => void;
  updateWorldModel: (update: Partial<WorldModel>) => void;
  addExperienceLog: (log: ExperienceLog) => void;
  addLearningRecord: (record: LearningRecord) => void;
  adjustPolicy: (update: { id: string; weight: number; reason: string; lastAdjustment: number }) => void;
}

const initialState = {
  user: null,
  profile: null,
  tenant: null,
  role: 'USER' as UserRole,
  plan: 'FREE' as SubscriptionPlan,
  permissions: [],
  impersonatingUser: null,
  loading: true,
  systemStatus: 'online' as const,
  cognitive: { gis: 74.2, ses: 48.5, msi: 41.2 },
  worldModel: { absorptionRate: 0.14, liquidityIndex: 0.48, priceElasticity: 1.15, demandSurge: 0.08, marketSophistication: 0.35 },
  experienceLogs: [],
  learningRecords: []
};

export const useGlobalStore = create<GlobalState>((set) => ({
  ...initialState,
  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  setGlobalLoading: (loading) => set({ loading }),
  setSystemStatus: (systemStatus) => set({ systemStatus }),
  setImpersonation: (impersonatingUser) => set({ impersonatingUser }),
  setCognitiveMetrics: (metrics) => set((state) => ({ cognitive: { ...state.cognitive, ...metrics } })),
  updateWorldModel: (update) => set((state) => ({ worldModel: { ...state.worldModel, ...update } })),
  addExperienceLog: (log) => set((state) => ({ experienceLogs: [log, ...state.experienceLogs].slice(0, 100) })),
  addLearningRecord: (record) => set((state) => ({ learningRecords: [record, ...state.learningRecords].slice(0, 50) })),
  adjustPolicy: (update) => { console.log(`[POLICY:ADJUST] ${update.id}: ${update.weight}`); },
  hydrateFromFirestore: (data) => {
    if (!data) return;
    set({
      profile: {
        id: data.id || '',
        email: data.email || '',
        name: data.name || '',
        role: (data.role as UserRole) || 'USER',
        plan: (data.plan as SubscriptionPlan) || 'FREE',
        tenantId: data.tenantId || 'default',
        userType: (data.userType as UserType) || 'normal',
        status: data.status || 'active'
      },
      role: (data.role as UserRole) || 'USER',
      plan: (data.plan as SubscriptionPlan) || 'FREE',
      tenant: data.tenantInfo ? {
        id: data.tenantId || 'default',
        name: data.tenantName || 'Organization',
        plan: (data.plan as SubscriptionPlan) || 'FREE',
        seatsMax: data.seatsMax || 1,
        seatsUsed: data.seatsUsed || 1,
        icp: data.icp || 75
      } : null
    });
  },
  reset: () => set(initialState)
}));
