import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Logging Middleware
 * 
 * RAZÓN DE DISEÑO:
 * - Logging de requests HTTP
 * - Métricas de performance
 * - Debugging en desarrollo
 * - Auditoría en producción
 */
export async function loggingMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const startTime = Date.now();

  // Log request
  request.log.info({
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers['user-agent'],
  }, 'Incoming request');

  // Hook para log response usando el hook del servidor
  reply.raw.on('finish', () => {
    const duration = Date.now() - startTime;
    
    request.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
    }, 'Request completed');
  });
}

