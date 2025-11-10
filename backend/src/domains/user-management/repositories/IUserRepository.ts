import { User } from '../entities/User';
import { Email } from '../value-objects/Email';
import { Username } from '../value-objects/Username';
import { UUID } from '@shared/value-objects/UUID';

/**
 * Interface del Repositorio de Usuarios
 * 
 * RAZÓN DE DISEÑO:
 * - Define contrato para persistencia de usuarios
 * - Permite cambiar implementación sin afectar dominio
 * - Ubicado en Domain Layer (interfaz, no implementación)
 * 
 * PRINCIPIOS:
 * - Dependency Inversion: Domain define la interfaz
 * - Repository Pattern: Abstrae acceso a datos
 */
export interface IUserRepository {
  /**
   * Guarda un usuario (crea o actualiza)
   */
  save(user: User): Promise<void>;

  /**
   * Busca un usuario por ID
   */
  findById(id: UUID): Promise<User | null>;

  /**
   * Busca un usuario por email
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Busca un usuario por username
   */
  findByUsername(username: Username): Promise<User | null>;

  /**
   * Verifica si un email ya existe
   */
  emailExists(email: Email): Promise<boolean>;

  /**
   * Verifica si un username ya existe
   */
  usernameExists(username: Username): Promise<boolean>;
}

