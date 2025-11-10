import Fastify from 'fastify';
import cors from '@fastify/cors';
import compress from '@fastify/compress';
import helmet from '@fastify/helmet';
import { designRoutes } from './routes/design.routes';
import { authRoutes } from './routes/auth.routes';
import { AuthController } from './controllers/AuthController';
import { errorHandler } from './middleware/error-handler.middleware';
import { rateLimitMiddleware } from './middleware/rate-limit.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { performanceMiddleware } from './middleware/performance.middleware';
import { setupSwagger } from './swagger/swagger.config';
import { container } from '../../infrastructure/dependency-injection/container';
import { HealthController } from './controllers/HealthController';

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

  // Security headers (Helmet)
  await server.register(helmet, {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
  });

  // Compression (gzip/brotli)
  await server.register(compress);

  // CORS (configurado para Angular)
  await server.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200', // Angular default port
    credentials: true,
  });

  // Swagger/OpenAPI (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    await setupSwagger(server);
  }

  // Health checks
  const healthController = new HealthController(container.get('PrismaClient'));
  server.get('/health', (request, reply) => healthController.liveness(request, reply));
  server.get('/health/ready', (request, reply) => healthController.readiness(request, reply));

  // Request ID middleware (primero, para tracking)
  server.addHook('onRequest', async (request, reply) => {
    await requestIdMiddleware(request, reply);
  });

  // Performance middleware (medir tiempo de respuesta)
  server.addHook('onRequest', async (request, reply) => {
    await performanceMiddleware(request, reply);
  });

  // Logging middleware (aplicar a todas las rutas)
  server.addHook('onRequest', async (request, reply) => {
    await loggingMiddleware(request, reply);
  });

  // Rate limiting (aplicar a todas las rutas excepto health)
  server.addHook('onRequest', async (request, reply) => {
    if (request.url !== '/health' && !request.url.startsWith('/health/')) {
      await rateLimitMiddleware(request, reply);
    }
  });

  // Error handler
  server.setErrorHandler(errorHandler);

  // Routes
  // Auth routes (sin autenticación requerida)
  await server.register(authRoutes, {
    prefix: '/api/v1/auth',
    authController: container.get<AuthController>('AuthController'),
  });

  // Design routes (requieren autenticación)
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

