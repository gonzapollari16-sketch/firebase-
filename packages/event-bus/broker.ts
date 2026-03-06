/**
 * @fileOverview CRUSHOME Event Broker (BullMQ Wrapper)
 * Centraliza la comunicación entre microservicios.
 */

import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { EventEmitter } from 'events';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * eventBus - Instancia de EventEmitter para comunicación interna (in-process).
 * Utilizada por servicios que requieren disparar eventos asíncronos no bloqueantes.
 */
export const eventBus = new EventEmitter();

export const createQueue = (name: string) => new Queue(name, { connection: connection as any });

export const startWorker = (name: string, processor: (job: Job) => Promise<void>) => {
  const worker = new Worker(name, processor, { connection: connection as any });
  
  worker.on('completed', (job) => {
    console.log(`[BROKER] Job ${job.id} in queue ${name} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[BROKER] Job ${job?.id} in queue ${name} failed: ${err.message}`);
  });

  return worker;
};

// Eventos Tipados Globales
export enum CrushomeEvent {
  MESSAGE_RECEIVED = 'incoming-messages',
  INTENT_PARSED = 'intent-parsed',
  MATCH_FOUND = 'match-found',
  NOTIFICATION_SENT = 'notification-sent',
  PROPERTY_DUPLICATED = 'property-duplicated',
  INVOICE_REQUESTED = 'billing.invoice_requested'
}
