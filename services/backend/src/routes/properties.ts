
import { FastifyInstance } from 'fastify';

/**
 * @fileOverview Rutas de Inventario de Propiedades.
 */
export async function propertyRoutes(fastify: FastifyInstance) {
  fastify.get('/', async () => {
    return { count: 0, items: [] };
  });

  fastify.post('/search', async (request: any) => {
    const { query } = request.body;
    return { query, results: [] };
  });
}
