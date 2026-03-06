'use client';

/**
 * @fileOverview Motor de Sindicación y Distribución Omnicanal.
 * Orquesta la salida de datos a portales, redes y comunidades.
 */

import { eventBus } from '../event-bus/event-bus';
import { PlanEngine } from '../plans/plan-engine';
import { SubscriptionPlan } from '@/lib/types';

export type SyndicationChannel = 'portal' | 'social' | 'community' | 'network' | 'email';

export interface SyndicationRequest {
  propertyId: string;
  tenantId: string;
  plan: SubscriptionPlan;
  channels: SyndicationChannel[];
  metadata?: Record<string, any>;
}

export class SyndicationEngine {
  /**
   * Ejecuta el pipeline de distribución para una propiedad.
   */
  static async distribute(request: SyndicationRequest) {
    const { propertyId, channels, plan, tenantId } = request;
    const results: Record<string, any> = {};

    console.log(`%c[Syndication] Starting distribution for ${propertyId}`, 'color: #C94BFF; font-weight: bold');

    for (const channel of channels) {
      // 1. Validar acceso por Plan
      const featureKey = this.getFeatureKeyForChannel(channel);
      if (!PlanEngine.canAccess(plan, featureKey)) {
        results[channel] = { status: 'blocked', reason: 'Upgrade required' };
        continue;
      }

      // 2. Ejecutar Adaptador
      try {
        const result = await this.pushToChannel(channel, request);
        results[channel] = result;
        
        // 3. Emitir evento de telemetría
        eventBus.emit('property.distributed', {
          propertyId,
          channel,
          tenantId,
          status: result.status,
          timestamp: new Date().toISOString()
        });
      } catch (err: any) {
        results[channel] = { status: 'error', message: err.message };
      }
    }

    return results;
  }

  private static getFeatureKeyForChannel(channel: SyndicationChannel): string {
    switch (channel) {
      case 'portal': return 'syndication:portals';
      case 'community': return 'community:private-network';
      case 'social': return 'syndication:omnichannel';
      default: return 'syndication:omnichannel';
    }
  }

  private static async pushToChannel(channel: SyndicationChannel, request: SyndicationRequest) {
    // Simulación de delay de red / API
    await new Promise(r => setTimeout(r, 800));

    switch (channel) {
      case 'portal':
        return { status: 'published', portal: 'Zonaprop', syncId: 'zp_' + Math.random().toString(36).substr(2, 9) };
      case 'community':
        return { status: 'active', network: 'Crushome Collab', reach: '1.2k brokers' };
      case 'social':
        return { status: 'sent', platforms: ['WhatsApp', 'Meta'], utm: 'src=crushome_auto' };
      default:
        return { status: 'completed' };
    }
  }
}
