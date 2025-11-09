import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Timeout Middleware
 * 
 * RAZÓN DE DISEÑO:
 * - Previene requests que se cuelguen
 * - Protege contra DoS
 * - Timeout configurable por endpoint
 * - Mejora experiencia de usuario
 */
const DEFAULT_TIMEOUT = 30000; // 30 segundos

export function timeoutMiddleware(timeoutMs: number = DEFAULT_TIMEOUT) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const timeout = setTimeout(() => {
      if (!reply.sent) {
        reply.status(504).send({
          error: 'Request timeout',
          message: `Request exceeded ${timeoutMs}ms timeout`,
        });
      }
    }, timeoutMs);

    // Limpiar timeout cuando la respuesta se envía
    reply.raw.on('finish', () => {
      clearTimeout(timeout);
    });
  };
}

