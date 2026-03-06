'use client';

/**
 * @fileOverview Outcome Intelligence Loop™ (OIL)
 * Correlación económica, cálculo de recompensas y ajuste de políticas.
 */

import { useGlobalStore } from '../state/global-store';
import { eventBus } from '../event-bus/event-bus';

export const OutcomeIntelligenceLoop = {
  /**
   * Evalúa el impacto económico de una acción finalizada.
   */
  async evaluate(data: any) {
    const store = useGlobalStore.getState();
    const { status, value, actionType, sourceRuleId } = data;

    // 1. Calcular Recompensa (Reward Engine)
    const reward = this.calculateReward(data);

    // 2. Correlación Económica
    if (value > 0) {
      console.log(`%c[OIL] Positive economic outcome detected: $${value}`, "color: #3CFF9E");
    }

    // 3. Ajuste de Política (Policy Adjustment Engine)
    if (sourceRuleId) {
      store.adjustPolicy({
        id: sourceRuleId,
        weight: reward > 50 ? 0.05 : -0.02,
        reason: `Outcome evaluation: ${status} with reward ${reward}`,
        lastAdjustment: Date.now()
      });
    }

    // 4. Actualizar GIS basado en ROI
    const gisBonus = reward > 80 ? 0.5 : -0.1;
    store.setCognitiveMetrics({ gis: Math.min(100, store.cognitive.gis + gisBonus) });

    eventBus.emit('ml.training_completed', { actionType, reward });
  },

  /**
   * Motor de Recompensa (Reward Engine)
   */
  calculateReward(metrics: any): number {
    let score = 0;
    
    // Tasa de éxito
    if (metrics.status === 'won' || metrics.status === 'closed_won') score += 60;
    
    // Impacto en velocidad (ejemplo: reducción de días en mercado)
    if (metrics.daysSaved > 0) score += Math.min(metrics.daysSaved * 2, 20);
    
    // Valor económico (comisión o ticket)
    if (metrics.value > 100000) score += 20;

    return score;
  }
};
