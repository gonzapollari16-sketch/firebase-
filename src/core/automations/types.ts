
/**
 * @fileOverview Tipos para el Motor de Reglas de Automatización.
 */

import { DomainEvent } from '../event-bus/event-bus';

export type ConditionOperator = 'equals' | 'not_equals' | 'gt' | 'lt' | 'contains' | 'in_list';

export interface AutomationCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
}

export type AutomationActionType = 
  | 'create_diffusion_draft' 
  | 'generate_ai_suggestion' 
  | 'run_matching' 
  | 'create_crm_opportunity' 
  | 'notify_user';

export interface AutomationAction {
  type: AutomationActionType;
  params: Record<string, any>;
}

export interface AutomationRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  enabled: boolean;
  triggerEvent: DomainEvent;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationMetadata {
  originId?: string;
  depth: number;
  ruleId?: string;
  isSystemGenerated: boolean;
}
