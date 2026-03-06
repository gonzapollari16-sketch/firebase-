
'use client';

/**
 * @fileOverview Motor de Selección de Anuncios (Ad Selection Engine).
 * Implementa la lógica de matching IA entre campañas y perfiles de usuario.
 */

import { AdCampaign, AdPlacement, Advertiser } from '@/lib/types';
import { eventBus } from '../event-bus/event-bus';

export const AdEngine = {
  /**
   * Registra una nueva campaña y emite evento al bus.
   */
  async createCampaign(data: Partial<AdCampaign>, tenantId: string) {
    const campaignId = `camp_${Math.random().toString(36).substring(7)}`;
    const payload = {
      ...data,
      id: campaignId,
      tenantId,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    console.log(`%c[AD:ENGINE] Campaign Created: ${payload.name}`, 'color: #3CFF9E');
    
    eventBus.emit('ads.campaign.created', payload);
    return payload;
  },

  /**
   * Calcula el ROI basado en la inversión y los leads generados del CRM.
   */
  calculateROI(spend: number, leads: number, avgLeadValue: number) {
    if (spend === 0) return 0;
    const revenue = leads * avgLeadValue;
    return (revenue - spend) / spend;
  },

  /**
   * Monitor de presupuesto preventivo.
   */
  checkBudget(campaign: AdCampaign) {
    if (campaign.spend >= campaign.dailyBudget * 0.9) {
      eventBus.emit('ads.budget.exceeded', {
        campaignId: campaign.id,
        tenantId: campaign.tenantId,
        limitReached: true
      });
    }
  }
};
