import { UUID } from '@shared/value-objects/UUID';
import { Email } from '../value-objects/Email';
import { Username } from '../value-objects/Username';
import { PasswordHash } from '../value-objects/PasswordHash';

/**
 * Entidad de Dominio: User
 * 
 * RAZÓN DE DISEÑO:
 * - Representa un usuario en el sistema
 * - Encapsula lógica de negocio relacionada con usuarios
 * - Inmutable (solo se crea, no se modifica directamente)
 * - Usa Value Objects para validación
 * 
 * PRINCIPIOS:
 * - Entity: Tiene identidad (UUID)
 * - Rich Domain Model: Contiene lógica de negocio
 * - Private constructor: Solo se crea mediante métodos estáticos
 */
export class User {
  private constructor(
    private readonly id: UUID,
    private readonly email: Email,
    private readonly username: Username,
    private readonly passwordHash: PasswordHash,
    private readonly walletAddress: string | null,
    private readonly createdAt: Date
  ) {}

  /**
   * Crea un nuevo usuario
   * @param email - Email del usuario
   * @param username - Username del usuario
   * @param passwordHash - Hash de la contraseña
   * @param walletAddress - Dirección de wallet (opcional)
   * @returns Nueva instancia de User y evento de dominio
   */
  static create(
    email: Email,
    username: Username,
    passwordHash: PasswordHash,
    walletAddress: string | null = null
  ): User {
    const id = UUID.create();
    const createdAt = new Date();

    return new User(id, email, username, passwordHash, walletAddress, createdAt);
  }

  /**
   * Reconstituye un usuario desde persistencia
   * Usado por repositorios para recrear entidades desde DB
   */
  static reconstitute(
    id: string,
    email: string,
    username: string,
    passwordHash: string,
    walletAddress: string | null,
    createdAt: Date
  ): User {
    return new User(
      UUID.fromString(id),
      Email.create(email),
      Username.create(username),
      PasswordHash.fromHash(passwordHash),
      walletAddress,
      createdAt
    );
  }

  /**
   * Vincula una wallet a un usuario
   * @returns Nueva instancia con wallet actualizada
   */
  linkWallet(walletAddress: string): User {
    if (!walletAddress || walletAddress.trim().length === 0) {
      throw new Error('Wallet address cannot be empty');
    }

    // Validar formato básico de dirección Ethereum (0x seguido de 40 caracteres hex)
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(walletAddress)) {
      throw new Error('Invalid Ethereum wallet address format');
    }

    return new User(
      this.id,
      this.email,
      this.username,
      this.passwordHash,
      walletAddress.toLowerCase(),
      this.createdAt
    );
  }

  // Getters
  getId(): UUID {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getUsername(): Username {
    return this.username;
  }

  getPasswordHash(): PasswordHash {
    return this.passwordHash;
  }

  getWalletAddress(): string | null {
    return this.walletAddress;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}

