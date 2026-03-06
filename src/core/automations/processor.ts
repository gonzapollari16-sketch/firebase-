
'use client';

/**
 * @fileOverview Procesador de acciones de automatización.
 * Genera registros en la Result Layer e integra feedback para IA.
 */

import { AutomationAction } from './types';
import { eventBus } from '../event-bus/event-bus';
import { AutomationIntelligence } from '../automation-intelligence/intelligence-engine';

export const ActionsProcessor = {
  /**
   * Procesa una lista de acciones generando registros intermedios (Result Layer).
   */
  async processActions(actions: AutomationAction[], eventData: any, tenantId: string, ruleId: string) {
    for (const action of actions) {
      await this.executeAction(action, eventData, tenantId, ruleId);
    }
  },

  /**
   * Ejecuta la acción generando un resultado pendiente de revisión.
   */
  async executeAction(action: AutomationAction, data: any, tenantId: string, ruleId: string) {
    const resultId = Math.random().toString(36).substring(7);
    
    const resultPayload = {
      id: resultId,
      ruleId,
      tenantId,
      sourceId: data.id,
      timestamp: new Date().toISOString(),
      status: 'pending_review',
      actionType: action.type,
      params: action.params
    };

    // Registro de telemetría
    this.logResult(action.type, resultPayload);

    switch (action.type) {
      case 'run_matching':
        eventBus.emit('match.suggested', { ...resultPayload, context: 'automation_rule' });
        break;

      case 'notify_user':
        eventBus.emit('notification.created', { 
          userId: data.userId || 'system',
          message: action.params.message || 'Automatización ejecutada con éxito',
          type: 'automation'
        });
        break;

      default:
        // En producción: persistencia en Firestore colección automation_results
        console.log(`[ActionsProcessor] Draft created for ${action.type}`, resultPayload);
        break;
    }
  },

  /**
   * Procesa la decisión del usuario (Aprobar/Rechazar) y alimenta la Inteligencia.
   * Este método debe ser invocado desde los componentes de UI.
   */
  async handleUserDecision(
    resultId: string, 
    ruleId: string, 
    tenantId: string, 
    status: 'approved' | 'rejected',
    entityInfo: { type: any, id: string },
    decisionTimeMs: number
  ) {
    // 1. Notificar a la Inteligencia para aprendizaje
    await AutomationIntelligence.recordDecision({
      tenantId,
      ruleId,
      automationResultId: resultId,
      actionType: 'automation_action', 
      status,
      timeToDecision: decisionTimeMs,
      entityType: entityInfo.type,
      entityId: entityInfo.id
    });

    // 2. Emitir evento de aprobación si corresponde
    if (status === 'approved') {
      eventBus.emit('automation.result.approved', { resultId, ruleId, tenantId });
    }
  },

  logResult(type: string, payload: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c[AUTOMATION:RESULT_LAYER] ${type} generated`, 'color: #3CFF9E', payload);
    }
  }
};
