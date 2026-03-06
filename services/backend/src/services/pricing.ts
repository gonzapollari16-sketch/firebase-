
/**
 * CRUSHOME INSTITUTIONAL PRICING ENGINE
 * Hybrid Model: Weighted Comparables + Momentum + Macro Adjustment
 */

export class PricingEngine {
  static calculate(basePrice: number, metrics: {
    compAvg: number,
    zoneTrend: number, // -1 to 1
    liquidity: number, // 0 to 1
    demandPressure: number // 0 to 1
  }) {
    const weights = {
      market: 0.50,
      momentum: 0.20,
      liquidity: 0.15,
      pressure: 0.15
    };

    // 1. Market Alignment (Comparables)
    const marketComponent = metrics.compAvg;

    // 2. Momentum Factor (Time-based trend)
    const trendAdj = 1 + (metrics.zoneTrend * 0.05);

    // 3. Liquidity Premium/Discount
    // Low liquidity reduces optimal price to force closing
    const liquidityAdj = metrics.liquidity < 0.4 ? 0.93 : 1.02;

    // 4. Demand Pressure
    const pressureAdj = 1 + (metrics.demandPressure * 0.03);

    const institutionalPrice = 
      (marketComponent * weights.market) +
      (basePrice * weights.momentum * trendAdj) +
      (basePrice * weights.liquidity * liquidityAdj) +
      (basePrice * weights.pressure * pressureAdj);

    return {
      suggestedPrice: Math.round(institutionalPrice),
      confidence: 0.85,
      signals: {
        trendImpact: metrics.zoneTrend > 0 ? 'positive' : 'negative',
        liquidityRisk: metrics.liquidity < 0.4 ? 'high' : 'low'
      }
    };
  }
}
