'use client';

import { PropertyFingerprint } from './types';

/**
 * @fileOverview Motor Probabilístico de Decisión.
 * Calcula la probabilidad de que dos propiedades sean la misma.
 */

export class DeduplicationScoring {
  /**
   * Calcula el score final de similitud entre 0 y 1.
   */
  static calculate(newProp: PropertyFingerprint, existing: PropertyFingerprint): number {
    const weights = {
      geo: 0.15,
      catastral: 0.35,
      structural: 0.30,
      visual: 0.10, // Placeholder
      textual: 0.10  // Placeholder
    };

    const scores = {
      geo: this.scoreGeo(newProp, existing),
      catastral: this.scoreCatastral(newProp, existing),
      structural: this.scoreStructural(newProp, existing),
      visual: 0.5, // Default neutro
      textual: 0.5  // Default neutro
    };

    const finalScore = 
      (scores.geo * weights.geo) +
      (scores.catastral * weights.catastral) +
      (scores.structural * weights.structural) +
      (scores.visual * weights.visual) +
      (scores.textual * weights.textual);

    return Math.min(1, Math.max(0, finalScore));
  }

  private static scoreGeo(a: PropertyFingerprint, b: PropertyFingerprint): number {
    if (a.lat === 0 || b.lat === 0) return 0;
    
    // Aproximación de distancia (Haversine simplificado)
    const dist = Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
    
    // Radios de cluster: 8m ~ 0.00008 grados
    if (dist < 0.0001) return 1;
    if (dist < 0.0005) return 0.7;
    if (dist < 0.001) return 0.3;
    return 0;
  }

  private static scoreCatastral(a: PropertyFingerprint, b: PropertyFingerprint): number {
    if (a.calle !== b.calle || a.numero !== b.numero) return 0;
    
    let score = 0.5; // Misma calle y nro
    if (a.piso === b.piso && a.piso !== '') score += 0.25;
    if (a.unidad === b.unidad && a.unidad !== '') score += 0.25;
    
    return score;
  }

  private static scoreStructural(a: PropertyFingerprint, b: PropertyFingerprint): number {
    let matches = 0;
    let total = 4;

    if (this.isNear(a.supTotal, b.supTotal, 0.05)) matches++;
    if (this.isNear(a.supCubierta, b.supCubierta, 0.05)) matches++;
    if (a.ambientes === b.ambientes) matches++;
    if (a.tipo === b.tipo) matches++;

    return matches / total;
  }

  private static isNear(val1: number, val2: number, tolerance: number): boolean {
    if (val1 === 0 || val2 === 0) return false;
    const diff = Math.abs(val1 - val2);
    return diff / val1 <= tolerance;
  }
}
