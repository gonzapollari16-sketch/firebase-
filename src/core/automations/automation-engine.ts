'use client';

/**
 * @fileOverview Motor de Automatización de CRUSHOME.
 * Orquestra reacciones inteligentes a eventos del sistema.
 */

import { eventBus } from '../event-bus/event-bus';
import { AutomationRulesEngine } from './rules-engine';
import { AutomationMetadata } from './types';

export class AutomationEngine {
  private static processedEvents = new Set<string>();

  /**
   * Inicializa los listeners globales de automatización.
   */
  static init() {
    if (typeof window === 'undefined') return;
    
    console.log("%c[CORE Automation] Engine Active", "color: #3CFF9E; font-weight: bold");

    const eventsToWatch: any[] = [
      'property.created', 'property.updated', 'search.created', 
      'lead.created', 'match.suggested', 'campaign.created'
    ];

    eventsToWatch.forEach(event => {
      eventBus.on(event, async (data) => {
        const metadata: AutomationMetadata = data._automation || { 
          depth: 0, 
          isSystemGenerated: false 
        };

        await this.handleStandardLogic(event, data, metadata);
        await AutomationRulesEngine.processEvent(event, data, metadata);
      });
    });
  }

  private static async handleStandardLogic(event: string, data: any, metadata: AutomationMetadata) {
    const eventKey = `${event}_${data.id}_${metadata.depth}`;
    if (this.processedEvents.has(eventKey)) return;

    if (event === 'property.created') {
      eventBus.emit('notification.created', {
        userId: data.userId,
        message: 'Propiedad protegida: Marca de agua forense lista para descarga.',
        type: 'media'
      });
    }

    this.processedEvents.add(eventKey);
  }
}
