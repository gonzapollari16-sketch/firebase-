
/**
 * @fileOverview Motor de Pricing Institucional Híbrido.
 * Implementa la lógica de valoración por comparables, momentum y ajuste macro.
 */

export interface PricingMetrics {
  basePrice: number;
  compAvg: number;
  zoneTrend: number; // -1 to 1
  liquidity: number; // 0 to 1
  demandPressure: number; // 0 to 1
  macroShock: number; // multiplier
}

export class PricingService {
  static calculateInstitutionalPrice(metrics: PricingMetrics) {
    const weights = {
      market: 0.40,
      momentum: 0.25,
      liquidity: 0.15,
      pressure: 0.20
    };

    // 1. Alineación con mercado (Comparables)
    const marketComponent = metrics.compAvg;

    // 2. Factor de Momentum (Ajuste por tendencia temporal)
    const trendAdjustment = 1 + (metrics.zoneTrend * 0.08);

    // 3. Prima de Liquidez (Descuento si la zona es lenta)
    const liquidityAdjustment = metrics.liquidity < 0.4 ? 0.92 : 1.03;

    // 4. Presión de Demanda
    const pressureAdjustment = 1 + (metrics.demandPressure * 0.05);

    // Fórmula Híbrida CRUSHOME
    const rawPrice = (
      (marketComponent * weights.market) +
      (metrics.basePrice * weights.momentum * trendAdjustment) +
      (metrics.basePrice * weights.liquidity * liquidityAdjustment) +
      (metrics.basePrice * weights.pressure * pressureAdjustment)
    );

    // Aplicar shock macroeconómico del simulador
    const finalPrice = rawPrice * metrics.macroShock;

    return {
      suggestedPrice: Math.round(finalPrice),
      confidenceScore: 0.88,
      adjustments: {
        trend: metrics.zoneTrend > 0 ? 'positive' : 'negative',
        liquidityRisk: metrics.liquidity < 0.4 ? 'high' : 'low',
        macroImpact: metrics.macroShock !== 1 ? 'active' : 'neutral'
      }
    };
  }
}
