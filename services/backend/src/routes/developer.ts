
import { FastifyInstance } from 'fastify';

/**
 * @fileOverview Rutas para Desarrolladores y API Keys.
 */
export async function developerRoutes(fastify: FastifyInstance) {
  fastify.get('/stats', async () => {
    return { apiCalls: 1240, latency: '12ms' };
  });
}
