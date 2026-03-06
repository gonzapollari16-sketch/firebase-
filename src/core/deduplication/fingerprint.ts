
'use client';

import { PropertyFingerprint } from './types';

/**
 * @fileOverview Motor de generación de huellas digitales para propiedades.
 */

export const FingerprintEngine = {
  build(data: any): PropertyFingerprint {
    return {
      tipo: data.tipo || '',
      calle: this.normalizeString(data.calle || ''),
      numero: this.normalizeString(data.numero || ''),
      piso: this.normalizeString(data.piso || ''),
      unidad: this.normalizeString(data.unidad || ''),
      supTotal: Number(data.supTotal) || 0,
      supCubierta: Number(data.supCubierta) || 0,
      ambientes: Number(data.ambientes) || 0,
      banos: Number(data.banos) || 0,
      cochera: !!data.cochera,
      lat: Number(data.lat) || 0,
      lng: Number(data.lng) || 0
    };
  },

  calculateHash(fp: PropertyFingerprint): string {
    const raw = `${fp.calle}|${fp.numero}|${fp.piso}|${fp.unidad}`.toLowerCase();
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  },

  normalizeString(val: string): string {
    return val.trim().toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
  }
};
