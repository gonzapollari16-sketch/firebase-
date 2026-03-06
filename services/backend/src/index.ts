
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { marketRoutes } from './routes/market';
import { propertyRoutes } from './routes/properties';
import { authRoutes } from './routes/auth';
import { developerRoutes } from './routes/developer';

const fastify = Fastify({
  logger: true
});

// PLUGINS
fastify.register(helmet);
fastify.register(cors, { origin: '*' });
fastify.register(jwt, { secret: process.env.JWT_SECRET || 'serie-a-secret-key' });

// AUTH MIDDLEWARE
fastify.decorate("authenticate", async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// ROUTES
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(marketRoutes, { prefix: '/api/market' });
fastify.register(propertyRoutes, { prefix: '/api/properties' });
fastify.register(developerRoutes, { prefix: '/api/developer' });

// HEALTH
fastify.get('/health', async () => ({ status: 'ok', tenancy: 'multi-tenant-active' }));

const start = async () => {
  try {
    await fastify.listen({ port: 4000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
