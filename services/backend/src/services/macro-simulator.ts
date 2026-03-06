
/**
 * MACROECONOMIC SIMULATOR
 * Real estate impact modeling for Inflation, Exchange Rates, and Interest
 */

export class MacroSimulator {
  static simulate(baseMetrics: { price: number, absorption: number }, shock: {
    inflationDelta: number,
    fxDelta: number,
    interestRateDelta: number
  }) {
    // 1. Elasticity constants
    const priceElasticity = -0.8; // Demand drops as price/rates go up
    const fxElasticity = -0.4;    // High FX delta slows down transactions

    // 2. Impact on Price
    // Inflation usually drives assets up but rates pull them down
    const priceImpact = (shock.inflationDelta * 0.6) - (shock.interestRateDelta * 0.4);
    const simulatedPrice = baseMetrics.price * (1 + priceImpact);

    // 3. Impact on Absorption (Velocity)
    // Higher rates significantly increase absorption months
    const absorptionImpact = (shock.interestRateDelta * 1.2) + (shock.fxDelta * 0.5);
    const simulatedAbsorption = baseMetrics.absorption * (1 + absorptionImpact);

    return {
      price: Math.round(simulatedPrice),
      absorptionMonths: Math.round(simulatedAbsorption),
      marketSentiment: priceImpact > 0 ? 'Expanding' : 'Contracting'
    };
  }
}
