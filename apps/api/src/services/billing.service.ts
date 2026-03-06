
/**
 * @fileOverview Orquestador de Pagos Omnicanal con Idempotencia y Dunning.
 * Maneja Stripe y MercadoPago con lógica unificada de auditoría.
 */
import { stripe } from '../config/stripe';
import { mp } from '../config/mercadopago';
import { db } from '@crushome/database';
import { createQueue } from '@crushome/event-bus';

const afipQueue = createQueue('afip-billing');

export class BillingService {
  
  /**
   * Maneja Webhooks de Stripe con verificación de firma.
   */
  async handleStripeWebhook(payload: any, signature: string) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      throw new Error('FALLA_FIRMA_WEBHOOK: Posible Replay Attack detectado.');
    }

    // IDEMPOTENCIA: Verificar log de auditoría externo
    const { id: eventId, type } = event;
    const isProcessed = await db.query('SELECT 1 FROM audit_logs WHERE external_event_id = $1', [eventId]);
    if (isProcessed.rowCount > 0) return { status: 'already_processed' };

    switch (type) {
      case 'invoice.paid':
        await this.processPaymentSuccess(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handleDunning(event.data.object);
        break;
    }

    // Registrar procesamiento exitoso
    await db.query('INSERT INTO audit_logs (action, external_event_id) VALUES ($1, $2)', ['STRIPE_WEBHOOK_OK', eventId]);
  }

  private async processPaymentSuccess(invoice: any) {
    const orgId = invoice.customer_metadata.organization_id;
    
    await db.query('UPDATE subscriptions SET status = $1, last_payment = NOW() WHERE organization_id = $2', ['active', orgId]);
    
    // Encolar facturación AFIP para evitar bloqueo del webhook
    await afipQueue.add('emitir-factura', {
      orgId,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency
    });
  }

  private async handleDunning(invoice: any) {
    const attempt = invoice.attempt_count;
    if (attempt >= 3) {
      await db.query('UPDATE organizations SET status = $1 WHERE id = $2', 
        ['suspended', invoice.customer_metadata.organization_id]);
    }
  }
}
