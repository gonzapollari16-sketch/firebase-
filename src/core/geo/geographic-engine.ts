'use client';

/**
 * @fileOverview Motor Geográfico Central de CRUSHOME.
 * Maneja normalización, jerarquía territorial y lógica de matching espacial.
 */

import { geoHierarchy } from '@/lib/location-data';

export interface GeoLocation {
  provincia: string;
  ciudad: string;
  barrio: string;
}

export const GeographicEngine = {
  /**
   * Normaliza una ubicación contra el dataset local.
   */
  normalize(input: Partial<GeoLocation>): GeoLocation {
    const provincia = this.findBestMatch(input.provincia || '', Object.keys(geoHierarchy)) || 'Otra';
    
    if (provincia === 'Otra' || !geoHierarchy[provincia]) {
      return {
        provincia: input.provincia || 'Otra',
        ciudad: input.ciudad || '',
        barrio: input.barrio || ''
      };
    }

    const ciudades = Object.keys(geoHierarchy[provincia]);
    const ciudad = this.findBestMatch(input.ciudad || '', ciudades) || ciudades[0];
    
    const barrios = geoHierarchy[provincia][ciudad];
    const barrio = this.findBestMatch(input.barrio || '', barrios) || input.barrio || '';

    return { provincia, ciudad, barrio };
  },

  /**
   * Determina si una propiedad 'p' está dentro del filtro geográfico 'f'.
   * Soporta matching jerárquico.
   */
  isMatch(property: GeoLocation, filter: Partial<GeoLocation>): boolean {
    if (filter.provincia && property.provincia !== filter.provincia) return false;
    if (filter.ciudad && property.ciudad !== filter.ciudad) return false;
    if (filter.barrio && property.barrio !== filter.barrio) return false;
    
    return true;
  },

  /**
   * Algoritmo simple de matching por texto (Fuzzy-ish).
   */
  findBestMatch(input: string, options: string[]): string | null {
    if (!input) return null;
    const normalizedInput = input.toLowerCase().trim();
    
    // 1. Match exacto
    const exact = options.find(o => o.toLowerCase() === normalizedInput);
    if (exact) return exact;

    // 2. Match por inclusión
    const partial = options.find(o => o.toLowerCase().includes(normalizedInput) || normalizedInput.includes(o.toLowerCase()));
    if (partial) return partial;

    return null;
  }
};
