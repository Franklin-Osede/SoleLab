import { FastifyRequest, FastifyReply, FastifyError } from 'fastify';

/**
 * Error Handler Centralizado
 * 
 * RAZÓN DE DISEÑO:
 * - Manejo centralizado de errores
 * - Convierte errores de dominio a respuestas HTTP apropiadas
 * - Logging de errores
 * - Respuestas consistentes
 */
export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error con request ID
  const requestId = (request as any).id || 'unknown';
  request.log.error({
    requestId,
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  }, 'Error occurred');

  // Agregar request ID a todas las respuestas de error
  reply.header('X-Request-ID', requestId);

  // Errores de validación (Zod)
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation error',
      details: error.validation,
      requestId,
    });
  }

  // Errores de dominio conocidos
  if (error.message.includes('not found') || error.message.includes('Not found')) {
    return reply.status(404).send({
      error: error.message,
      requestId,
    });
  }

  if (error.message.includes('required') || error.message.includes('invalid')) {
    return reply.status(400).send({
      error: error.message,
      requestId,
    });
  }

  // Errores de autenticación/autorización (futuro)
  if (error.statusCode === 401 || error.statusCode === 403) {
    return reply.status(error.statusCode).send({
      error: error.message || 'Unauthorized',
      requestId,
    });
  }

  // Error genérico
  return reply.status(error.statusCode || 500).send({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    requestId,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}

