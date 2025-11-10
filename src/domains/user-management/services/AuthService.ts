import * as bcrypt from 'bcrypt';
import { PasswordHash } from '../value-objects/PasswordHash';
import { User } from '../entities/User';

/**
 * Servicio de Dominio: AuthService
 * 
 * RAZÓN DE DISEÑO:
 * - Encapsula lógica de autenticación (hashing, verificación)
 * - Separa lógica de negocio de infraestructura
 * - Facilita testing (puede mockearse)
 * 
 * PRINCIPIOS:
 * - Single Responsibility: Solo maneja autenticación
 * - Domain Service: Lógica que no pertenece a una entidad específica
 */
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  /**
   * Genera hash de contraseña
   */
  async hashPassword(password: string): Promise<PasswordHash> {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const hash = await bcrypt.hash(password, this.SALT_ROUNDS);
    return PasswordHash.fromHash(hash);
  }

  /**
   * Verifica si una contraseña coincide con el hash
   */
  async verifyPassword(password: string, user: User): Promise<boolean> {
    if (!password) {
      return false;
    }

    return bcrypt.compare(password, user.getPasswordHash().getValue());
  }
}

