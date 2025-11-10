import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

/**
 * Request ID Middleware
 * 
 * RAZÓN DE DISEÑO:
 * - Agrega ID único a cada request
 * - Facilita tracking y debugging
 * - Útil para logs distribuidos
 * - Mejora trazabilidad de errores
 */
export async function requestIdMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const requestId = request.headers['x-request-id'] || randomUUID();
  
  // Agregar al request
  (request as any).id = requestId;
  
  // Agregar header a la respuesta
  reply.header('X-Request-ID', requestId);
}

