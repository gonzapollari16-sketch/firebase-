
import { FastifyInstance } from 'fastify';

/**
 * @fileOverview Rutas de Inteligencia de Mercado.
 */
export async function marketRoutes(fastify: FastifyInstance) {
  fastify.get('/status', async () => {
    return { 
      status: 'active', 
      engine: 'Crushome-Market-V5',
      timestamp: new Date().toISOString() 
    };
  });

  fastify.get('/trends', async () => {
    return [
      { zone: 'Palermo', trend: 'bullish', confidence: 0.92 },
      { zone: 'Belgrano', trend: 'stable', confidence: 0.88 }
    ];
  });
}
