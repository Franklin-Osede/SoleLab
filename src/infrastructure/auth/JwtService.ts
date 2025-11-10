import * as jwt from 'jsonwebtoken';
import { UUID } from '@shared/value-objects/UUID';

/**
 * Servicio JWT para generar y verificar tokens
 * 
 * RAZÓN DE DISEÑO:
 * - Encapsula lógica de JWT
 * - Separado de dominio (es infraestructura)
 * - Facilita testing y cambio de implementación
 */
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (this.secret === 'your-secret-key-change-in-production') {
      console.warn('⚠️  WARNING: Using default JWT secret. Change JWT_SECRET in production!');
    }
  }

  /**
   * Genera un token JWT para un usuario
   */
  generateToken(userId: UUID, email: string): string {
    const payload = {
      userId: userId.toString(),
      email,
      iat: Math.floor(Date.now() / 1000),
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Verifica y decodifica un token JWT
   * @returns Payload del token o null si es inválido
   */
  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, this.secret) as {
        userId: string;
        email: string;
      };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extrae el token del header Authorization
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}

