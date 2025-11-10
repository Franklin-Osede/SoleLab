import { FastifyReply } from 'fastify';

/**
 * Response Utilities
 * 
 * RAZÓN DE DISEÑO:
 * - Respuestas consistentes
 * - Formato estándar
 * - Facilita debugging
 * - Mejora experiencia de frontend
 */
export class ResponseUtil {
  static success(reply: FastifyReply, data: any, statusCode: number = 200) {
    return reply.status(statusCode).send({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    reply: FastifyReply,
    message: string,
    statusCode: number = 500,
    details?: any
  ) {
    return reply.status(statusCode).send({
      success: false,
      error: {
        message,
        details,
        timestamp: new Date().toISOString(),
      },
    });
  }

  static paginated(
    reply: FastifyReply,
    data: any[],
    page: number,
    pageSize: number,
    total: number
  ) {
    return reply.status(200).send({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      timestamp: new Date().toISOString(),
    });
  }
}

