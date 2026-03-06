
'use client';

/**
 * @fileOverview Event Bus Global Evolucionado (Neural Bus).
 * Soporta aprendizaje sistémico, telemetría cognitiva y trazabilidad causal.
 */

export type DomainEvent = 
  | 'property.created' | 'property.updated' | 'property.deleted' | 'property.distributed'
  | 'search.created' | 'lead.created' 
  | 'match.suggested' | 'opportunity.closed'
  | 'auth.state_changed' | 'system.error' | 'system.tool_updated'
  | 'notification.created' | 'automation.result.approved'
  | 'growth.recommendation.created' | 'media.downloaded'
  | 'icp.updated'
  | 'automation.result.generated'
  | 'automation.suggestion.created'
  | 'automation.result.rejected'
  | 'ads.campaign.created'
  | 'ads.placement.updated'
  | 'ads.budget.exceeded'
  | 'ads.roi.recalculated'
  | 'cognitive.process'
  | 'cognitive.drift_detected'
  | 'cognitive.gradient_shared'
  | 'digital_twin.updated'
  | 'ml.training_completed'
  | 'ml.prediction_deviation';

type EventCallback<T = any> = (data: T) => void;

interface CognitiveMetadata {
  origin: string;
  ts: number;
  depth: number;
  impact: 'low' | 'medium' | 'high' | 'evaluating';
  causalId?: string;
}

class EventBus {
  private listeners: Map<DomainEvent, EventCallback[]> = new Map();

  on<T = any>(event: DomainEvent, callback: EventCallback<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
    return () => this.off(event, callback);
  }

  off(event: DomainEvent, callback: EventCallback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      this.listeners.set(event, eventListeners.filter(cb => cb !== callback));
    }
  }

  emit(event: DomainEvent, data?: any) {
    const payload = data || {};
    
    // Inyectar metadatos cognitivos (Neural Layer)
    if (!payload._cognitive) {
      payload._cognitive = {
        origin: event,
        ts: Date.now(),
        depth: 0,
        impact: 'evaluating',
        causalId: Math.random().toString(36).substring(7)
      } as CognitiveMetadata;
    } else {
      payload._cognitive.depth++;
    }

    if (process.env.NODE_ENV === 'development' && !event.startsWith('cognitive')) {
      console.log(`%c[NEURAL BUS] Emitting: ${event}`, 'color: #FF4FD8; font-weight: bold', payload);
    }
    
    const targets = this.listeners.get(event);
    if (targets) {
      targets.forEach(callback => {
        try {
          setTimeout(() => callback(payload), 0);
        } catch (err) {
          console.error(`[EventBus] Error in subscriber for ${event}:`, err);
        }
      });
    }

    // AUTO-LEARNING TRIGGER: Cada evento de dominio retroalimenta al cerebro
    if (!event.startsWith('cognitive') && !event.startsWith('ml')) {
      this.emit('cognitive.process', { originalEvent: event, data: payload });
    }
  }
}

export const eventBus = new EventBus();
