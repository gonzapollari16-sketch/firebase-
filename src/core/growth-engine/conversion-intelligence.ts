'use client';

/**
 * @fileOverview Inteligencia de Conversión.
 * Analiza el embudo de ventas para detectar patrones de éxito.
 */

import { GrowthLearningStore } from './growth-learning-store';

export const ConversionIntelligence = {
  /**
   * Analiza un evento de cierre de oportunidad.
   */
  async analyzeOpportunityClosed(data: any) {
    const { tenantId, id, status, value, propertyType, zone } = data;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c[ConversionIntel] Analyzing closure for ${id}: ${status}`, 'color: #4F6BFF');
    }

    // 1. Registrar aprendizaje comercial
    const success = status === 'won' || status === 'closed_won';
    
    // Si la oportunidad vino de una automatización, actualizamos su score
    if (data.sourceRuleId) {
      await GrowthLearningStore.updateMetrics(tenantId, data.sourceRuleId, 'automation', { success, value });
    }

    // Si vino de una campaña, actualizamos ROI
    if (data.campaignId) {
      await GrowthLearningStore.updateMetrics(tenantId, data.campaignId, 'campaign', { success, value });
    }

    // 2. Extraer insights territoriales (esto alimentaría el heatmap en el futuro)
    this.extractTerritorialInsights(zone, propertyType, success);
  },

  extractTerritorialInsights(zone: string, type: string, success: boolean) {
    // Lógica para detectar que "Departamentos en Palermo cierran 20% más rápido"
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ConversionIntel] Insights for ${zone}: success=${success}`);
    }
  }
};
