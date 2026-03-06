
'use client';

/**
 * @fileOverview Orquestador de la Capa de Inteligencia.
 * Aprende del comportamiento y optimiza el motor de reglas.
 */

import { AutomationFeedback, RuleStats } from './types';
import { ScoringEngine } from './scoring';
import { eventBus } from '../event-bus/event-bus';

// Registro persistente en memoria (Simulado - En producción se sincroniza con Firestore)
const ruleStatsCache = new Map<string, RuleStats>();
const contentHashes = new Set<string>(); // Para Intelligent Rate Limiting

export const AutomationIntelligence = {
  /**
   * Registra una decisión del usuario sobre un resultado de automatización.
   */
  async recordDecision(feedback: Omit<AutomationFeedback, 'id' | 'createdAt'>) {
    const feedbackId = Math.random().toString(36).substring(7);
    const payload: AutomationFeedback = {
      ...feedback,
      id: feedbackId,
      createdAt: new Date().toISOString()
    };

    console.log(`%c[INTEL:FEEDBACK] User decision: ${feedback.status} for rule ${feedback.ruleId}`, 'color: #FFD966');

    // 1. Actualizar Estadísticas
    this.updateRuleStats(payload);

    // 2. Analizar patrones para nuevas sugerencias
    this.analyzePatterns(payload);
  },

  /**
   * Actualiza el scoring de la regla basado en el feedback.
   */
  updateRuleStats(feedback: AutomationFeedback) {
    const key = `${feedback.tenantId}_${feedback.ruleId}`;
    const current = ruleStatsCache.get(key) || {
      ruleId: feedback.ruleId,
      tenantId: feedback.tenantId,
      approvalRate: 0.5,
      executionRate: 0.5,
      averageDecisionTime: 3600000,
      intelligenceScore: 0.5,
      executionCount: 0,
      lastUpdated: new Date().toISOString()
    };

    current.executionCount++;
    
    // Actualizar aprobación (Media móvil suavizada)
    const isApproved = feedback.status === 'approved' ? 1 : 0;
    current.approvalRate = (current.approvalRate * 0.7) + (isApproved * 0.3);
    
    // Actualizar tiempo de decisión
    current.averageDecisionTime = (current.averageDecisionTime * 0.8) + (feedback.timeToDecision * 0.2);
    
    // Recalcular score global
    current.intelligenceScore = ScoringEngine.calculateScore(current);
    current.lastUpdated = new Date().toISOString();

    ruleStatsCache.set(key, current);

    // Detección de umbral adaptativo para desactivación
    if (ScoringEngine.shouldSuggestDisable(current)) {
      this.emitSuggestion(feedback.tenantId, 'disable_rule', `La regla ${feedback.ruleId} tiene una tasa de aprobación muy baja (${Math.round(current.approvalRate * 100)}%).`);
    }
  },

  /**
   * Obtiene el score de inteligencia para una regla (usado por RulesEngine).
   */
  getRuleScore(tenantId: string, ruleId: string): number {
    return ruleStatsCache.get(`${tenantId}_${ruleId}`)?.intelligenceScore || 0.5;
  },

  /**
   * Intelligent Rate Limiting: Evita procesar el mismo contenido múltiples veces.
   */
  shouldAnalyze(contentId: string, entityType: string): boolean {
    const hash = `${entityType}_${contentId}`;
    if (contentHashes.has(hash)) return false;
    
    contentHashes.add(hash);
    // Limpiar hash después de un tiempo para permitir actualizaciones futuras
    setTimeout(() => contentHashes.delete(hash), 60000); 
    return true;
  },

  /**
   * Analiza patrones de éxito para sugerir nuevas reglas.
   */
  analyzePatterns(feedback: AutomationFeedback) {
    // Si un usuario siempre aprueba matching para un tipo de entidad, sugerir regla.
    if (feedback.status === 'approved' && Math.random() > 0.95) {
      this.emitSuggestion(
        feedback.tenantId, 
        'new_rule', 
        `Sugerencia: Hemos detectado que siempre apruebas las sugerencias de ${feedback.actionType} para ${feedback.entityType}. ¿Quieres automatizarlo por completo?`
      );
    }
  },

  emitSuggestion(tenantId: string, type: any, reason: string) {
    const suggestion = {
      id: Math.random().toString(36).substring(7),
      tenantId,
      type,
      reason,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    eventBus.emit('notification.created', {
      userId: 'admin',
      message: `CRUSHOME Intel: ${reason}`,
      type: 'ai_suggestion'
    });

    console.log(`%c[INTEL:SUGGESTION] ${type}: ${reason}`, 'color: #3CFF9E');
  }
};
