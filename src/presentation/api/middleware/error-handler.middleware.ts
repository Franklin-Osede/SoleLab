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
  // Log error
  request.log.error(error);

  // Errores de validación (Zod)
  if (error.validation) {
    return reply.status(400).send({
      error: 'Validation error',
      details: error.validation,
    });
  }

  // Errores de dominio conocidos
  if (error.message.includes('not found') || error.message.includes('Not found')) {
    return reply.status(404).send({
      error: error.message,
    });
  }

  if (error.message.includes('required') || error.message.includes('invalid')) {
    return reply.status(400).send({
      error: error.message,
    });
  }

  // Errores de autenticación/autorización (futuro)
  if (error.statusCode === 401 || error.statusCode === 403) {
    return reply.status(error.statusCode).send({
      error: error.message || 'Unauthorized',
    });
  }

  // Error genérico
  return reply.status(error.statusCode || 500).send({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
  });
}

