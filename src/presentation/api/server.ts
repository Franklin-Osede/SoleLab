import Fastify from 'fastify';
import cors from '@fastify/cors';
import { designRoutes } from './routes/design.routes';

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

  // CORS
  await server.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  });

  // Health check
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

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
}

