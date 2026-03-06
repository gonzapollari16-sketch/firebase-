/**
 * @fileOverview Definición de tipos para el Motor de Deduplicación.
 */

export type DuplicateMatchLevel = 'UNIQUE' | 'PROBABLE' | 'EXACT';

export interface DuplicateResult {
  level: DuplicateMatchLevel;
  score: number;
  matchedPropertyId?: string;
  matchedAgencyId?: string;
  reason?: string;
}

export interface PropertyFingerprint {
  tipo: string;
  calle: string;
  numero: string;
  piso: string;
  unidad: string;
  supTotal: number;
  supCubierta: number;
  ambientes: number;
  banos: number;
  cochera: boolean;
  lat: number;
  lng: number;
  hash?: string;
}
