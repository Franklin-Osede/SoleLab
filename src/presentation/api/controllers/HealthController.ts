import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

/**
 * Health Check Controller
 * 
 * RAZÓN DE DISEÑO:
 * - Verifica estado del servidor
 * - Verifica conexión a base de datos
 * - Útil para load balancers y monitoring
 * - Diferencia entre liveness y readiness
 */
export class HealthController {
  constructor(private prisma: PrismaClient) {}

  /**
   * Health check básico (liveness)
   * Verifica que el servidor está corriendo
   */
  async liveness(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  }

  /**
   * Health check completo (readiness)
   * Verifica que el servidor está listo para recibir requests
   */
  async readiness(request: FastifyRequest, reply: FastifyReply) {
    const checks: Record<string, { status: string; message?: string }> = {
      server: { status: 'ok' },
    };

    // Verificar base de datos
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = { status: 'ok' };
    } catch (error) {
      checks.database = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Database connection failed',
      };
    }

    // Determinar estado general
    const allHealthy = Object.values(checks).every((check) => check.status === 'ok');
    const statusCode = allHealthy ? 200 : 503;

    return reply.status(statusCode).send({
      status: allHealthy ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString(),
    });
  }
}

