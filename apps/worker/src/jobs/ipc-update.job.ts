
/**
 * @fileOverview Motor de Actualización IPC Semestral Automática.
 * Bloqueo distribuido vía Redis para evitar actualizaciones dobles.
 */
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { db } from '@crushome/database';
import { stripe } from '@crushome/billing';

const redis = new Redis(process.env.REDIS_URL!);

export const ipcWorker = new Worker('ipc-updates', async (job: Job) => {
  const { rate } = job.data;
  const lockKey = `ipc_lock_${new Date().getFullYear()}_H${new Date().getMonth() < 6 ? '1' : '2'}`;

  // BLOQUEO DISTRIBUIDO (NX: Set if Not Exists)
  const acquired = await redis.set(lockKey, 'processing', 'EX', 3600, 'NX');
  if (!acquired) return;

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // Seleccionar suscripciones mensuales activas con FOR UPDATE SKIP LOCKED
    const subs = await client.query(`
      SELECT id, stripe_subscription_id, current_price 
      FROM subscriptions 
      WHERE billing_cycle = 'monthly' AND status = 'active'
      FOR UPDATE SKIP LOCKED
    `);

    for (const sub of subs.rows) {
      const newPrice = sub.current_price * (1 + (rate / 100));
      
      // 1. Actualizar DB Local
      await client.query('UPDATE subscriptions SET current_price = $1, last_ipc_update = NOW() WHERE id = $2', [newPrice, sub.id]);

      // 2. Actualizar Gateway (Stripe)
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        items: [{
          id: sub.stripe_item_id,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(newPrice * 100),
            recurring: { interval: 'month' },
            product: process.env.STRIPE_PRODUCT_ID!
          }
        }],
        procation_behavior: 'none' // No cobrar retroactivo
      });
    }

    await client.query('COMMIT');
    await redis.set(lockKey, 'completed', 'EX', 86400); // Bloquear por 24h
  } catch (err) {
    await client.query('ROLLBACK');
    await redis.del(lockKey);
    throw err;
  } finally {
    client.release();
  }
}, { connection: redis as any });
