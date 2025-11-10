import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '@domains/user-management/repositories/IUserRepository';
import { User } from '@domains/user-management/entities/User';
import { Email } from '@domains/user-management/value-objects/Email';
import { Username } from '@domains/user-management/value-objects/Username';
import { UUID } from '@shared/value-objects/UUID';

/**
 * Implementación de IUserRepository usando Prisma
 * 
 * RAZÓN DE DISEÑO:
 * - Implementa la interfaz del dominio
 * - Convierte entre modelos de Prisma y entidades de dominio
 * - Ubicado en Infrastructure Layer
 * 
 * PRINCIPIOS:
 * - Repository Pattern: Abstrae acceso a datos
 * - Dependency Inversion: Implementa interfaz del dominio
 */
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User): Promise<void> {
    const userData = {
      id: user.getId().toString(),
      email: user.getEmail().getValue(),
      username: user.getUsername().getValue(),
      passwordHash: user.getPasswordHash().getValue(),
      walletAddress: user.getWalletAddress(),
      createdAt: user.getCreatedAt(),
    };

    await this.prisma.user.upsert({
      where: { id: userData.id },
      create: userData,
      update: {
        email: userData.email,
        username: userData.username,
        passwordHash: userData.passwordHash,
        walletAddress: userData.walletAddress,
      },
    });
  }

  async findById(id: UUID): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id: id.toString() },
    });

    if (!userData) {
      return null;
    }

    return this.toDomainEntity(userData);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!userData) {
      return null;
    }

    return this.toDomainEntity(userData);
  }

  async findByUsername(username: Username): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { username: username.getValue() },
    });

    if (!userData) {
      return null;
    }

    return this.toDomainEntity(userData);
  }

  async emailExists(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.getValue() },
    });

    return count > 0;
  }

  async usernameExists(username: Username): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { username: username.getValue() },
    });

    return count > 0;
  }

  /**
   * Convierte modelo de Prisma a entidad de dominio
   */
  private toDomainEntity(data: {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    walletAddress: string | null;
    createdAt: Date;
  }): User {
    return User.reconstitute(
      data.id,
      data.email,
      data.username,
      data.passwordHash,
      data.walletAddress,
      data.createdAt
    );
  }
}

