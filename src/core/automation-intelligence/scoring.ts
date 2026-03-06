
'use client';

/**
 * @fileOverview Motor de cálculo de efectividad (Scoring Engine).
 * Implementa la fórmula comercial de CRUSHOME.
 */

import { RuleStats } from './types';

export const ScoringEngine = {
  /**
   * Calcula el score de inteligencia basado en la fórmula:
   * score = (approval_rate * 0.5) + (execution_rate * 0.3) + (speed_factor * 0.2)
   */
  calculateScore(stats: Partial<RuleStats>): number {
    const approvalWeight = (stats.approvalRate || 0) * 0.5;
    const executionWeight = (stats.executionRate || 0) * 0.3;
    
    // Speed factor: Decisiones en menos de 2 horas (7200000ms) se consideran óptimas
    const idealTime = 7200000;
    const speedFactor = stats.averageDecisionTime 
      ? Math.max(0, 1 - (stats.averageDecisionTime / (idealTime * 4))) // Cae significativamente después de 8 horas
      : 0.5;
    
    const speedWeight = speedFactor * 0.2;

    const totalScore = approvalWeight + executionWeight + speedWeight;
    return Math.min(1, Math.max(0, totalScore));
  },

  /**
   * Determina si una regla debería sugerirse para desactivación.
   * Criterio: approvalRate < 20% después de al menos 10 ejecuciones.
   */
  shouldSuggestDisable(stats: RuleStats): boolean {
    return stats.executionCount >= 10 && stats.approvalRate < 0.2;
  }
};
