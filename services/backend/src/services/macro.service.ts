
/**
 * @fileOverview Simulador Macroeconómico Inmobiliario.
 * Modela el impacto de variables externas en la absorción y precio.
 */

export interface MacroShock {
  inflationDelta: number; // e.g. 0.10 for +10%
  fxDelta: number; // e.g. 0.20 for +20% devaluation
  mortgageRateDelta: number; // e.g. 0.05 for +5 points
}

export class MacroSimulatorService {
  /**
   * Calcula el multiplicador de impacto basado en elasticidades del mercado real.
   */
  static simulateImpact(baseMetrics: { price: number, absorption: number }, shock: MacroShock) {
    // Coeficientes de elasticidad (Valores típicos de mercado emergente)
    const elasticity = {
      priceToInflation: 0.65, // Los activos suben con la inflación pero no 1:1
      demandToFX: -0.45,      // Grandes devaluaciones frenan la demanda
      absorptionToRates: 1.4  // La tasa hipotecaria impacta fuerte en el tiempo de venta
    };

    // 1. Impacto en Precio
    const priceImpact = (shock.inflationDelta * elasticity.priceToInflation) - (shock.mortgageRateDelta * 0.2);
    const simulatedPrice = baseMetrics.price * (1 + priceImpact);

    // 2. Impacto en Absorción (Meses en mercado)
    // Shock cambiario + Tasas altas = Mercado lento
    const absorptionImpact = (Math.abs(shock.fxDelta) * 0.5) + (shock.mortgageRateDelta * elasticity.absorptionToRates);
    const simulatedAbsorption = baseMetrics.absorption * (1 + absorptionImpact);

    return {
      priceMultiplier: 1 + priceImpact,
      absorptionMultiplier: 1 + absorptionImpact,
      simulatedPrice: Math.round(simulatedPrice),
      simulatedAbsorption: Math.round(simulatedAbsorption * 10) / 10,
      marketSentiment: priceImpact > 0.05 ? 'Expanding' : priceImpact < -0.05 ? 'Contracting' : 'Stagnant'
    };
  }
}
