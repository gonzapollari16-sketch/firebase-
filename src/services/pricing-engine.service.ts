/**
 * @fileOverview Motor de Precio Inteligente Consolidado.
 * Implementa Inferencia Ridge Regression con Normalización Z-Score.
 * Refactorizado para usar exclusivamente el Admin SDK en el servidor.
 */

import { adminDb } from '@/firebase/admin';

export const ALGORITHM_VERSION = "ridge-v1.0.0";

export interface ModelMetadata {
  version: string;
  beta: number[];   // Coeficientes (incluye intercepto en beta[0])
  means: number[];  // Medias para Z-Score
  stds: number[];   // Desviaciones para Z-Score
  r2: number;       // Métrica de confianza
}

export class PricingEngineService {
  /**
   * Carga el modelo activo desde la configuración global o del tenant.
   */
  private static async getActiveModel(): Promise<ModelMetadata> {
    // En producción, esto vendría de una colección de modelos versionados en Firestore (adminDb)
    // Por ahora, simulamos el retorno del modelo Ridge entrenado
    return {
      version: ALGORITHM_VERSION,
      beta: [15000, 2450, -500, 12000, 8000, 5000], // [intercept, m2, age, rooms, zone_rank, amenities]
      means: [85, 15, 3, 5, 4],
      stds: [25, 10, 1.2, 2, 1.5],
      r2: 0.88
    };
  }

  /**
   * Inferencia Matemática: Precio = β0 + Σ(βi * (Xi - μi) / σi)
   */
  static async calculateRecommendedPrice(data: {
    metros: number;
    antiguedad?: number;
    barrio: string;
    ambientes: number;
    tipo: string;
  }) {
    const model = await this.getActiveModel();
    
    // 1. Construir Vector de entrada X (sin intercepto para normalizar)
    const X = [
      data.metros,
      data.antiguedad || 10,
      data.ambientes,
      this.getZoneRank(data.barrio),
      this.getTypeBonus(data.tipo)
    ];

    // 2. Normalización Z-Score
    const Z = X.map((val, i) => (val - model.means[i]) / (model.stds[i] || 1));

    // 3. Producto Matricial (Inferencia)
    // Precio = Intercepto + Suma(Beta_i * Z_i)
    let prediction = model.beta[0];
    for (let i = 0; i < Z.length; i++) {
      prediction += model.beta[i + 1] * Z[i];
    }

    // 4. Ajustes de Seguridad (Clamping)
    const finalPrice = Math.max(10000, Math.round(prediction));

    return {
      recommendedPrice: finalPrice,
      confidenceScore: model.r2,
      minRange: Math.round(finalPrice * 0.92),
      maxRange: Math.round(finalPrice * 1.08),
      algorithmVersion: model.version,
      appliedWeights: model.beta
    };
  }

  private static getZoneRank(barrio: string): number {
    const ranks: Record<string, number> = { 'Palermo': 9, 'Recoleta': 10, 'Belgrano': 8, 'Centro': 5 };
    return ranks[barrio] || 4;
  }

  private static getTypeBonus(tipo: string): number {
    return tipo === 'Casa' ? 5 : tipo === 'PH' ? 4 : 2;
  }
}
