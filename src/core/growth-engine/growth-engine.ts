'use client';

/**
 * @fileOverview Growth Engine Autónomo de CRUSHOME.
 */

import { eventBus, DomainEvent } from '../event-bus/event-bus';
import { ConversionIntelligence } from './conversion-intelligence';
import { GrowthRecommendationEngine } from './growth-recommendation-engine';

export class GrowthEngine {
  static init() {
    if (typeof window === 'undefined') return;

    console.log("%c[CORE GrowthEngine] Active and Learning", "color: #FF4FD8; font-weight: bold");

    const eventsToWatch: DomainEvent[] = [
      'property.created',
      'lead.created',
      'opportunity.closed'
    ];

    eventsToWatch.forEach(event => {
      eventBus.on(event, async (data) => {
        if (data._automation?.depth > 2) return;

        if (event === 'opportunity.closed') {
          await ConversionIntelligence.analyzeOpportunityClosed(data);
        }

        await GrowthRecommendationEngine.evaluate(event, data);
      });
    });
  }
}
