import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Performance Middleware
 * 
 * RAZÓN DE DISEÑO:
 * - Mide tiempo de respuesta
 * - Agrega headers de performance
 * - Útil para monitoring
 * - Identifica endpoints lentos
 */
export async function performanceMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const startTime = process.hrtime.bigint();

  reply.raw.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - startTime) / 1_000_000; // Convertir a ms
    reply.header('X-Response-Time', `${duration.toFixed(2)}ms`);
    
    // Log si es lento (>1s)
    if (duration > 1000) {
      request.log.warn({
        url: request.url,
        method: request.method,
        duration: `${duration.toFixed(2)}ms`,
      }, 'Slow request detected');
    }
  });
}

