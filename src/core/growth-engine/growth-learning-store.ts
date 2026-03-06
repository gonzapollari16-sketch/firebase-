'use client';

/**
 * @fileOverview Base de aprendizaje del Growth Engine.
 * Almacena scores de efectividad comercial por canal y automatización.
 */

export interface GrowthMetric {
  id: string;
  tenantId: string;
  entityId: string; // campaignId o automationId
  type: 'campaign' | 'automation';
  conversionRate: number;
  revenueImpact: number;
  acceptanceRate: number;
  intelligenceScore: number;
  lastUpdated: string;
}

// Registro en memoria (Simulado para prod: Firestore collection 'growth_learning')
const metricsCache = new Map<string, GrowthMetric>();

export const GrowthLearningStore = {
  /**
   * Actualiza los scores basados en resultados reales de conversión.
   */
  async updateMetrics(tenantId: string, entityId: string, type: 'campaign' | 'automation', results: { success: boolean, value?: number }) {
    const key = `${tenantId}_${entityId}`;
    const current = metricsCache.get(key) || {
      id: key,
      tenantId,
      entityId,
      type,
      conversionRate: 0.1,
      revenueImpact: 0,
      acceptanceRate: 0.5,
      intelligenceScore: 0.5,
      lastUpdated: new Date().toISOString()
    };

    // Factor de aprendizaje: media móvil ponderada
    const learningRate = 0.15;
    
    if (results.success) {
      current.conversionRate = (current.conversionRate * (1 - learningRate)) + (1 * learningRate);
      if (results.value) {
        current.revenueImpact += results.value;
      }
    } else {
      current.conversionRate = (current.conversionRate * (1 - learningRate));
    }

    // Recalcular Score de Inteligencia Comercial
    current.intelligenceScore = (current.conversionRate * 0.6) + (current.acceptanceRate * 0.4);
    current.lastUpdated = new Date().toISOString();

    metricsCache.set(key, current);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c[GrowthStore] Updated ${type} ${entityId}: Score ${current.intelligenceScore.toFixed(2)}`, 'color: #3CFF9E');
    }
  },

  getMetric(tenantId: string, entityId: string): GrowthMetric | undefined {
    return metricsCache.get(`${tenantId}_${entityId}`);
  }
};
