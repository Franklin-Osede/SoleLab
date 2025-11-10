import { User } from '../entities/User';
import { Email } from '../value-objects/Email';
import { Username } from '../value-objects/Username';
import { PasswordHash } from '../value-objects/PasswordHash';
import { IUserRepository } from '../repositories/IUserRepository';
import { AuthService } from './AuthService';

/**
 * Servicio de Dominio: UserRegistrationService
 * 
 * RAZÓN DE DISEÑO:
 * - Encapsula lógica de registro de usuarios
 * - Aplica reglas de negocio (email único, username único)
 * - Separa lógica de negocio de casos de uso
 * 
 * PRINCIPIOS:
 * - Single Responsibility: Solo maneja registro
 * - Domain Service: Lógica de negocio compleja
 */
export class UserRegistrationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService
  ) {}

  /**
   * Registra un nuevo usuario
   * @throws Error si el email o username ya existen
   */
  async register(
    email: Email,
    username: Username,
    password: string,
    walletAddress: string | null = null
  ): Promise<User> {
    // Verificar que el email no existe
    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new Error('Email already registered');
    }

    // Verificar que el username no existe
    const usernameExists = await this.userRepository.usernameExists(username);
    if (usernameExists) {
      throw new Error('Username already taken');
    }

    // Generar hash de contraseña
    const passwordHash = await this.authService.hashPassword(password);

    // Crear usuario
    const user = User.create(email, username, passwordHash, walletAddress);

    // Guardar
    await this.userRepository.save(user);

    return user;
  }
}

