import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Rate Limiting Middleware
 * 
 * RAZÓN DE DISEÑO:
 * - Protege API de abuso
 * - Limita requests por IP
 * - Evita sobrecarga del servidor
 * - Importante para servicios de IA (costosos)
 */
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests por minuto

export async function rateLimitMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const clientId = request.ip || 'unknown';
  const now = Date.now();

  // Limpiar entradas expiradas
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });

  // Obtener o crear entrada para este cliente
  if (!store[clientId]) {
    store[clientId] = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
  }

  const clientData = store[clientId];

  // Verificar si excedió el límite
  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return reply.status(429).send({
      error: 'Too many requests',
      message: `Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_WINDOW} requests per minute.`,
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
    });
  }

  // Incrementar contador
  clientData.count++;

  // Agregar headers de rate limit
  reply.header('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
  reply.header('X-RateLimit-Remaining', (MAX_REQUESTS_PER_WINDOW - clientData.count).toString());
  reply.header('X-RateLimit-Reset', clientData.resetTime.toString());
}

