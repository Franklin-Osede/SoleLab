import { UserRegistrationService } from '@domains/user-management/services/UserRegistrationService';
import { Email } from '@domains/user-management/value-objects/Email';
import { Username } from '@domains/user-management/value-objects/Username';
import { User } from '@domains/user-management/entities/User';

/**
 * Caso de Uso: RegisterUserUseCase
 * 
 * RAZÓN DE DISEÑO:
 * - Orquesta el flujo de registro de usuario
 * - Coordina servicios de dominio e infraestructura
 * - Retorna DTOs para la capa de presentación
 * 
 * PRINCIPIOS:
 * - Use Case: Un caso de uso = un flujo de negocio
 * - Application Layer: Orquesta, no contiene lógica de negocio
 */
export interface RegisterUserRequest {
  email: string;
  username: string;
  password: string;
  walletAddress?: string;
}

export interface RegisterUserResponse {
  id: string;
  email: string;
  username: string;
  walletAddress: string | null;
  createdAt: Date;
}

export class RegisterUserUseCase {
  constructor(private readonly userRegistrationService: UserRegistrationService) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    // Validar y crear Value Objects
    const email = Email.create(request.email);
    const username = Username.create(request.username);

    // Registrar usuario
    const user = await this.userRegistrationService.register(
      email,
      username,
      request.password,
      request.walletAddress || null
    );

    // Retornar DTO
    return {
      id: user.getId().toString(),
      email: user.getEmail().getValue(),
      username: user.getUsername().getValue(),
      walletAddress: user.getWalletAddress(),
      createdAt: user.getCreatedAt(),
    };
  }
}

