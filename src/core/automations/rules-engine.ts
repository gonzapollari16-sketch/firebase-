'use client';

/**
 * @fileOverview Orquestador del Motor de Reglas.
 * Filtra por tenant, evalúa condiciones y dispara acciones con PRIORIZACIÓN INTELIGENTE.
 * Sincronizado con tipos operativos finales.
 */

import { DomainEvent, eventBus } from '../event-bus/event-bus';
import { AutomationRule, AutomationMetadata } from './types';
import { RulesEvaluator } from './evaluator';
import { ActionsProcessor } from './processor';
import { AutomationIntelligence } from '../automation-intelligence/intelligence-engine';

// Mock de reglas (En producción se cargan de Firestore por tenantId)
const MOCK_RULES: AutomationRule[] = [
  {
    id: 'rule_1',
    tenantId: 'default',
    name: 'Auto-Matching Premium',
    description: 'Ejecuta matching para propiedades de lujo',
    enabled: true,
    triggerEvent: 'property.created',
    priority: 1,
    conditions: [
      { field: 'precio', operator: 'gt', value: 100000 }
    ],
    actions: [
      { type: 'run_matching', params: {} },
      { type: 'generate_ai_suggestion', params: { tone: 'professional' } }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const AutomationRulesEngine = {
  async processEvent(event: DomainEvent, data: any, metadata: AutomationMetadata) {
    if (metadata.depth > 3) return;

    const tenantId = data.tenantId || 'default';
    
    const activeRules = MOCK_RULES
      .filter(r => r.tenantId === tenantId && r.triggerEvent === event && r.enabled)
      .map(r => ({
        ...r,
        intelligenceScore: AutomationIntelligence.getRuleScore(tenantId, r.id)
      }));

    if (activeRules.length === 0) return;

    const sortedRules = activeRules.sort((a, b) => {
      const scoreA = (a as any).intelligenceScore || 0;
      const scoreB = (b as any).intelligenceScore || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return b.priority - a.priority;
    });

    for (const rule of sortedRules) {
      if (!AutomationIntelligence.shouldAnalyze(data.id, event)) continue;

      const matches = RulesEvaluator.shouldExecute(rule, data);
      
      if (matches) {
        await ActionsProcessor.processActions(rule.actions, data, tenantId, rule.id);
      }
    }
  }
};
