
/**
 * @fileOverview Jobs de Background para Billing.
 * Incluye actualización IPC semestral y Dunning.
 */
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { db } from '@crushome/database';

const redis = new Redis(process.env.REDIS_URL!);

export const ipcUpdateWorker = new Worker('ipc-updates', async (job) => {
  const { rate } = job.data;
  const lockKey = `ipc_lock_${new Date().getFullYear()}`;

  // Bloqueo distribuido para evitar ejecuciones dobles
  // ioredis set signature: (key, value, expiryMode, time, setMode)
  const lock = await redis.set(lockKey, 'locked', 'EX', 3600, 'NX');
  if (!lock) return;

  const subscriptions = await db.subscriptions.findMany({
    where: { status: 'active', billingCycle: 'monthly' }
  });

  for (const sub of subscriptions) {
    const newPrice = sub.price * (1 + rate / 100);
    await db.subscriptions.update({
      where: { id: sub.id },
      data: { price: newPrice, lastIpcUpdate: new Date() }
    });
    // Aquí se dispararía la actualización en el Gateway (Stripe/MP)
  }
}, { connection: redis as any });
