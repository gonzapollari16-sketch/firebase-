'use client';

/**
 * @fileOverview Motor de Digital Twin del Mercado.
 * Representación matemática dinámica de la oferta, demanda y comportamiento.
 */

export const DigitalTwinEngine = {
  /**
   * Calcula el impacto de un evento real en el modelo del mundo.
   */
  calculateUpdate(event: string, data: any) {
    let update: any = {};

    switch (event) {
      case 'property.created':
        // Aumento de oferta -> Impacta elasticidad y liquidez
        update = {
          absorptionRate: -0.001, 
          liquidityIndex: -0.002,
          demandSurge: 0.001
        };
        break;

      case 'search.created':
        // Aumento de demanda -> Impacta precio y presión
        update = {
          demandSurge: 0.005,
          liquidityIndex: 0.003
        };
        break;

      case 'opportunity.closed':
        // Cierre real -> Factor de éxito crítico
        update = {
          absorptionRate: 0.01,
          liquidityIndex: 0.008
        };
        break;

      case 'icp.updated':
        // Reputación de red -> Sofisticación del mercado
        update = {
          marketSophistication: 0.02
        };
        break;
    }

    return update;
  },

  /**
   * Simula un escenario de "What If" en el Digital Twin.
   */
  simulateScenario(baseState: any, shock: { type: 'inflation' | 'rate' | 'supply', intensity: number }) {
    const result = { ...baseState };
    
    if (shock.type === 'rate') {
      result.absorptionRate *= (1 - (shock.intensity * 1.5));
      result.priceElasticity *= (1 + shock.intensity);
    }

    return result;
  }
};