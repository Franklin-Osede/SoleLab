import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware de Validación
 * 
 * RAZÓN DE DISEÑO:
 * - Valida requests HTTP antes de llegar a controllers
 * - Reutilizable para cualquier schema de Zod
 * - Retorna errores de validación claros
 * - Type-safe validation
 */
export function validateRequest<T>(schema: ZodSchema<T>) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Validar body, params, query según el schema
      const dataToValidate = {
        ...(request.body as object),
        ...(request.params as object),
        ...(request.query as object),
      };

      const validated = schema.parse(dataToValidate);

      // Agregar datos validados al request
      (request as any).validated = validated;
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      return reply.status(500).send({
        error: 'Internal validation error',
      });
    }
  };
}

