
/**
 * @fileOverview Orquestador de Billing Enterprise.
 * Centraliza Gateways, Idempotencia y Auditoría Contable.
 */
import { db } from '@crushome/database';
import { eventBus } from '@crushome/event-bus';
import { StripeService } from '../payments/stripe.service';
import { AfipService } from '../afip/afip.service';

export class BillingService {
  /**
   * Procesa un pago exitoso con idempotencia garantizada.
   */
  static async handlePaymentSuccess(payload: {
    externalId: string;
    gateway: 'stripe' | 'mercadopago';
    tenantId: string;
    amount: number;
    currency: string;
  }) {
    // 1. Verificación de Idempotencia (Audit Log)
    const alreadyProcessed = await db.auditLogs.findUnique({
      where: { externalEventId: payload.externalId }
    });
    if (alreadyProcessed) return { status: 'skipped', reason: 'duplicate' };

    return await db.$transaction(async (tx) => {
      // 2. Actualizar estado de suscripción
      await tx.subscriptions.update({
        where: { tenantId: payload.tenantId },
        data: { status: 'active', lastPayment: new Date() }
      });

      // 3. Registrar en Audit Log Inmutable
      await tx.auditLogs.create({
        data: {
          action: 'PAYMENT_RECEIVED',
          externalEventId: payload.externalId,
          tenantId: payload.tenantId,
          metadata: payload
        }
      });

      // 4. Encolar Facturación Electrónica (No bloqueante)
      await eventBus.emit('billing.invoice_requested', {
        tenantId: payload.tenantId,
        amount: payload.amount,
        externalId: payload.externalId
      });

      return { status: 'success' };
    });
  }
}
