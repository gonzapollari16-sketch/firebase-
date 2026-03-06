'use client';

/**
 * @fileOverview Motor de Recomendaciones de Crecimiento.
 * Genera sugerencias estratégicas basadas en datos de conversión, búsquedas y ahora PUBLICIDAD.
 */

import { eventBus } from '../event-bus/event-bus';
import { GrowthLearningStore } from './growth-learning-store';

export class GrowthRecommendationEngine {
  /**
   * Evalúa si debe generar una recomendación ante un evento.
   */
  static async evaluate(event: string, data: any) {
    const tenantId = data.tenantId || 'default';

    switch (event) {
      case 'property.created':
        await this.recommendForNewProperty(data, tenantId);
        break;
      
      case 'opportunity.closed':
        await this.recommendOnSuccess(data, tenantId);
        break;

      case 'search.created':
        await this.recommendOnHighDemand(data, tenantId);
        break;
    }
  }

  private static async recommendForNewProperty(property: any, tenantId: string) {
    if (property.price < 150000 && (property.zone === 'Centro' || property.barrio === 'Centro')) {
      this.emitRecommendation(tenantId, {
        type: 'boost_diffusion',
        title: 'Oportunidad de Alta Conversión',
        description: 'Propiedades similares en esta zona cierran en menos de 15 días. Sugerimos activar campaña Pro en Meta Ads.',
        impact: 'high',
        action: 'Activar Difusión Premium'
      });
    }
  }

  private static async recommendOnSuccess(data: any, tenantId: string) {
    if (data.status === 'won' || data.status === 'closed_won') {
      this.emitRecommendation(tenantId, {
        type: 'replication_strategy',
        title: 'Estrategia Exitosa Detectada',
        description: 'Este tipo de cierre fue altamente eficiente. ¿Querés que busquemos propiedades similares para captar?',
        impact: 'medium',
        action: 'Ver propiedades similares'
      });
    }
  }

  private static async recommendOnHighDemand(search: any, tenantId: string) {
    if (search.resultsCount === 0 && search.type === 'geo_bbox') {
      this.emitRecommendation(tenantId, {
        type: 'captation_needed',
        title: 'Demanda No Satisfecha',
        description: `Detectamos usuarios buscando activamente en esta zona sin encontrar stock. Sugerimos captación proactiva.`,
        impact: 'high',
        action: 'Ver Mapa de Demanda'
      });
    }
  }

  private static emitRecommendation(tenantId: string, recommendation: any) {
    const payload = {
      id: Math.random().toString(36).substring(7),
      tenantId,
      ...recommendation,
      createdAt: new Date().toISOString()
    };

    if (process.env.NODE_ENV === 'development') {
      console.log(`%c[GrowthRecommendation] Created: ${recommendation.title}`, 'color: #FF4FD8');
    }

    eventBus.emit('growth.recommendation.created', payload);
  }
}