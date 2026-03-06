'use client';

import { DuplicateResult, PropertyFingerprint } from './types';
import { FingerprintEngine } from './fingerprint';
import { DeduplicationScoring } from './scoring';

/**
 * @fileOverview Orquestador del Motor de Detección de Duplicados.
 */

export const DuplicateDetector = {
  /**
   * Analiza una propiedad contra un conjunto de propiedades existentes.
   */
  analyze(newPropData: any, existingProperties: any[]): DuplicateResult {
    const newFP = FingerprintEngine.build(newPropData);
    const newHash = FingerprintEngine.calculateHash(newFP);

    let bestMatch = { id: '', score: 0, agencyId: '' };

    for (const existing of existingProperties) {
      const existingFP = FingerprintEngine.build(existing);
      const existingHash = FingerprintEngine.calculateHash(existingFP);

      // 1. Detección Exacta por Hash Catastral
      if (newHash === existingHash && newFP.piso !== '') {
        return {
          level: 'EXACT',
          score: 1,
          matchedPropertyId: existing.id,
          matchedAgencyId: existing.userId || existing.tenantId,
          reason: 'Coincidencia catastral exacta (Dirección + Piso + Unidad)'
        };
      }

      // 2. Scoring Probabilístico
      const score = DeduplicationScoring.calculate(newFP, existingFP);
      if (score > bestMatch.score) {
        bestMatch = { 
          id: existing.id, 
          score, 
          agencyId: existing.userId || existing.tenantId 
        };
      }
    }

    // Clasificación de resultados
    if (bestMatch.score > 0.85) {
      return {
        level: 'EXACT',
        score: bestMatch.score,
        matchedPropertyId: bestMatch.id,
        matchedAgencyId: bestMatch.agencyId,
        reason: 'Similitud crítica en estructura y ubicación'
      };
    }

    if (bestMatch.score > 0.70) {
      return {
        level: 'PROBABLE',
        score: bestMatch.score,
        matchedPropertyId: bestMatch.id,
        matchedAgencyId: bestMatch.agencyId,
        reason: 'Similitud alta. Requiere revisión manual.'
      };
    }

    return {
      level: 'UNIQUE',
      score: bestMatch.score
    };
  }
};
