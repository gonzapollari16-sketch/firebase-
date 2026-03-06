'use client';

/**
 * @fileOverview Motor de Búsqueda Espacial.
 * Incluye bypass de resolución de tipos para @turf/turf.
 */

// @ts-ignore
import * as turf from '@turf/turf';
import { Property } from '@/lib/types';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export const SpatialSearchEngine = {
  filterByRadius(properties: Property[], center: GeoPoint, radiusMeters: number): Property[] {
    const centerPoint = turf.point([center.lng, center.lat]);
    
    return properties.filter(p => {
      if (p.lat === undefined || p.lng === undefined) return false;
      const propPoint = turf.point([p.lng, p.lat]);
      const distance = turf.distance(centerPoint, propPoint, { units: 'meters' });
      return distance <= radiusMeters;
    });
  },

  filterByPolygon(properties: Property[], polygon: any): Property[] {
    return properties.filter(p => {
      if (p.lat === undefined || p.lng === undefined) return false;
      const pt = turf.point([p.lng, p.lat]);
      return turf.booleanPointInPolygon(pt, polygon);
    });
  },

  filterByBBox(properties: Property[], bounds: { west: number; south: number; east: number; north: number }): Property[] {
    return properties.filter(p => {
      if (p.lat === undefined || p.lng === undefined) return false;
      return (
        p.lng >= bounds.west &&
        p.lng <= bounds.east &&
        p.lat >= bounds.south &&
        p.lat <= bounds.north
      );
    });
  },

  calculateHotspot(properties: Property[]): GeoPoint | null {
    if (properties.length === 0) return null;
    
    const points = properties.map(p => turf.point([p.lng!, p.lat!]));
    const fc = turf.featureCollection(points);
    const centroid = turf.centroid(fc);
    
    return {
      lat: centroid.geometry.coordinates[1],
      lng: centroid.geometry.coordinates[0]
    };
  },

  createCircleGeoJSON(center: GeoPoint, radiusMeters: number) {
    return turf.circle([center.lng, center.lat], radiusMeters, {
      steps: 64,
      units: 'meters'
    });
  }
};