/**
 * @fileOverview Punto de entrada para el módulo de Billing.
 * Exporta el servicio y las configuraciones de gateways.
 */

export * from './billing.service';
export { stripe } from '../../config/stripe';
export { mp } from '../../config/mercadopago';