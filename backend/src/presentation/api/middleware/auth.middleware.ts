import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService } from '@infrastructure/auth/JwtService';

/**
 * Authentication Middleware
 * 
 * RAZÓN DE DISEÑO:
 * - Valida JWT tokens en requests
 * - Extrae userId del token y lo agrega al request
 * - Protege rutas que requieren autenticación
 * 
 * USO:
 * - Agregar userId al request: (request as any).userId
 * - Lanzar error si token inválido
 */
const jwtService = new JwtService();

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Extraer token del header
  const authHeader = request.headers.authorization;
  const token = jwtService.extractTokenFromHeader(authHeader);

  if (!token) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Missing or invalid authorization header',
    });
  }

  // Verificar token
  const payload = jwtService.verifyToken(token);
  if (!payload) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }

  // Agregar userId al request para uso en controllers
  (request as any).userId = payload.userId;
  (request as any).userEmail = payload.email;
}

/**
 * Middleware opcional: extrae userId si existe token, pero no falla si no hay
 * Útil para rutas que pueden funcionar con o sin autenticación
 */
export async function optionalAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;
  const token = jwtService.extractTokenFromHeader(authHeader);

  if (token) {
    const payload = jwtService.verifyToken(token);
    if (payload) {
      (request as any).userId = payload.userId;
      (request as any).userEmail = payload.email;
    }
  }
  // Si no hay token o es inválido, simplemente continúa sin userId
}
