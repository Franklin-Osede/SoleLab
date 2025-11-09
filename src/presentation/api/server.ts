import Fastify from 'fastify';
import cors from '@fastify/cors';
import { designRoutes } from './routes/design.routes';
import { errorHandler } from './middleware/error-handler.middleware';
import { rateLimitMiddleware } from './middleware/rate-limit.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { setupSwagger } from './swagger/swagger.config';

/**
 * Servidor API REST con Fastify
 * 
 * RAZÓN DE DISEÑO:
 * - Fastify es más rápido que Express
 * - Mejor type-safety
 * - Plugin system poderoso
 * - Perfecto para APIs REST
 * 
 * ALTERNATIVA: Express también es válido, pero Fastify es mejor para este proyecto
 */
export async function createServer() {
  const server = Fastify({
    logger: process.env.NODE_ENV === 'development',
  });

  // CORS (configurado para Angular)
  await server.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200', // Angular default port
    credentials: true,
  });

  // Swagger/OpenAPI (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    await setupSwagger(server);
  }

  // Health check (sin rate limit)
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Logging middleware (aplicar a todas las rutas)
  server.addHook('onRequest', async (request, reply) => {
    await loggingMiddleware(request, reply);
  });

  // Rate limiting (aplicar a todas las rutas excepto health)
  server.addHook('onRequest', async (request, reply) => {
    if (request.url !== '/health') {
      await rateLimitMiddleware(request, reply);
    }
  });

  // Error handler
  server.setErrorHandler(errorHandler);

  // Routes
  await server.register(designRoutes, { prefix: '/api/v1/designs' });

  return server;
}

export async function startServer() {
  const server = await createServer();
  
  try {
    const port = parseInt(process.env.PORT || '3001', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    console.log(`🚀 Server listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }

  return server;
}

