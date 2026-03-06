
import { FastifyInstance } from 'fastify';

/**
 * @fileOverview Rutas de Autenticación.
 */
export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request: any) => {
    return { token: 'mock-jwt-token' };
  });

  fastify.get('/me', async () => {
    return { id: 'system', role: 'ADMIN' };
  });
}
