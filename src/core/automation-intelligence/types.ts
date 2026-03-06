
/**
 * @fileOverview Tipos para la capa de Inteligencia de Automatización.
 */

export type DecisionStatus = 'approved' | 'rejected' | 'ignored';

export interface AutomationFeedback {
  id: string;
  tenantId: string;
  ruleId: string;
  automationResultId: string;
  actionType: string;
  status: DecisionStatus;
  timeToDecision: number; // ms
  entityType: 'property' | 'client' | 'match' | 'campaign';
  entityId: string;
  createdAt: string;
}

export interface RuleStats {
  ruleId: string;
  tenantId: string;
  approvalRate: number;
  executionRate: number;
  averageDecisionTime: number;
  intelligenceScore: number;
  executionCount: number;
  lastUpdated: string;
}

export interface AutomationSuggestion {
  id: string;
  tenantId: string;
  type: 'new_rule' | 'optimize_rule' | 'disable_rule';
  reason: string;
  proposedConfig: any;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
