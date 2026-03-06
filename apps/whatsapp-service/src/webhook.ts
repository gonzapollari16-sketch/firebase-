
/**
 * @fileOverview WhatsApp Webhook Handler (Meta Platforms)
 * Implementa validación oficial y dispatch de eventos al Event Bus.
 */

import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
// Cast to any to resolve ioredis version conflict in bullmq types
const messageQueue = new Queue('incoming-messages', { connection: redisConnection as any });

export async function handleMetaWebhook(req: any, res: any) {
  // 1. Verificación de Webhook (Meta GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Verification failed');
  }

  // 2. Recepción de Mensaje (Meta POST)
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const message = value?.messages?.[0];

  if (message) {
    // 3. Encolar evento para procesamiento asíncrono
    await messageQueue.add('process-intent', {
      phone: message.from,
      text: message.text?.body,
      timestamp: message.timestamp,
      metaId: message.id,
      tenantId: 'resolved-tenant-id' // Lógica de resolución de tenant por número
    });

    console.log(`[WA-SERVICE] Message ${message.id} queued for CRUSHOME IA`);
  }

  res.sendStatus(200);
}
