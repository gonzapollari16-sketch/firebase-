'use client';

/**
 * @fileOverview Experience Learning Engine™ (ELE)
 * Convierte logs reales en conocimiento estructurado y detecta fricción.
 */

import { useGlobalStore, ExperienceLog } from '../state/global-store';
import { eventBus } from '../event-bus/event-bus';

export const ExperienceLearningEngine = {
  /**
   * Analiza un evento cognitivo para extraer patrones de experiencia.
   */
  async analyze(payload: any) {
    const store = useGlobalStore.getState();
    const { originalEvent, data } = payload;

    // 1. Detección de Fricción
    const isFriction = this.detectFriction(originalEvent, data);

    // 2. Crear Log de Experiencia
    const log: ExperienceLog = {
      id: Math.random().toString(36).substring(7),
      userId: store.user?.uid || 'system',
      action: originalEvent,
      success: !isFriction && !data.error,
      frictionDetected: isFriction,
      economicImpact: data.value || 0,
      timestamp: Date.now()
    };

    store.addExperienceLog(log);

    // 3. Generar Insight Adaptativo
    if (isFriction) {
      eventBus.emit('cognitive.drift_detected', { 
        module: data.module, 
        reason: 'Repeated friction pattern' 
      });
    }
  },

  /**
   * Detecta patrones de fricción (errores repetidos, lentitud, abandonos).
   */
  detectFriction(event: string, data: any): boolean {
    // Ejemplo: Si el geocoding falla 3 veces, es fricción crítica
    if (event === 'system.error' && data.code === 'GEO_FAILURE') return true;
    
    // Si una búsqueda IA no devuelve resultados (Miss)
    if (event === 'search.created' && data.resultsCount === 0) return true;

    return false;
  }
};
