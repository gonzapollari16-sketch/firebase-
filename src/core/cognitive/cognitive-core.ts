
'use client';

/**
 * @fileOverview Cerebro Central de CRUSHOME (Cognitive Core).
 * Orquestador de aprendizaje, federación y evolución sistémica.
 */

import { eventBus } from '../event-bus/event-bus';
import { useGlobalStore } from '../state/global-store';
import { DigitalTwinEngine } from './digital-twin-engine';
import { ExperienceLearningEngine } from './experience-engine';
import { OutcomeIntelligenceLoop } from './outcome-loop';
import { KnowledgeMaestro } from './maestro-engine';

export class CognitiveCore {
  private static active = false;

  /**
   * Inicializa el cerebro del sistema.
   */
  static init() {
    if (this.active || typeof window === 'undefined') return;
    this.active = true;

    console.log("%c[COGNITIVE CORE] Neural Network Online", "color: #FF4FD8; font-weight: bold");

    // 1. ELE: Experience Learning Engine
    eventBus.on('cognitive.process', async (payload) => {
      await ExperienceLearningEngine.analyze(payload);
      await this.syncWorldModel(payload);
    });

    // 2. OIL: Outcome Intelligence Loop
    eventBus.on('opportunity.closed', async (data) => {
      await OutcomeIntelligenceLoop.evaluate(data);
    });

    // 3. KCP: Knowledge Control Plane
    eventBus.on('system.tool_updated', async (info) => {
      await KnowledgeMaestro.reindex(info);
    });

    // 4. Ciclos de evolución sistémica
    setInterval(() => this.runEvolutionCycle(), 1800000); // 30 min
    setInterval(() => this.shareGradients(), 600000);    // 10 min
  }

  /**
   * Sincroniza el Digital Twin con eventos del mundo real.
   */
  private static async syncWorldModel(payload: any) {
    const store = useGlobalStore.getState();
    const update = DigitalTwinEngine.calculateUpdate(payload.originalEvent, payload.data);
    
    if (Object.keys(update).length > 0) {
      store.updateWorldModel(update);
      store.addLearningRecord({
        ts: Date.now(),
        event: payload.originalEvent,
        impact: update.demandSurge ? 'growth' : 'adjustment'
      });
    }
  }

  /**
   * Recalibra métricas de evolución sistémica (SES).
   */
  private static async runEvolutionCycle() {
    const store = useGlobalStore.getState();
    const logs = store.experienceLogs;
    const health = logs.length > 0 ? logs.filter(l => l.success).length / logs.length : 0.5;
    
    const sesDelta = (health - 0.5) * 2;
    store.setCognitiveMetrics({ ses: Math.min(100, Math.max(0, store.cognitive.ses + sesDelta)) });
    
    console.log(`%c[CORE:EVOLUTION] System Health: ${Math.round(health * 100)}% | SES calibrated to ${store.cognitive.ses.toFixed(1)}`, 'color: #3B82F6');
  }

  /**
   * Comparte pesos sinápticos anonimizados entre Tenants (Enterprise Only).
   */
  private static shareGradients() {
    const store = useGlobalStore.getState();
    if (store.plan !== 'ENTERPRISE') return;

    const delta = (Math.random() - 0.2) * 0.5;
    store.setCognitiveMetrics({ gis: Math.min(100, store.cognitive.gis + delta) });
    eventBus.emit('cognitive.gradient_shared', { delta });
  }
}
