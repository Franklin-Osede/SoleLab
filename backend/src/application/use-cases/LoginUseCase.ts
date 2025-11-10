import { IUserRepository } from '@domains/user-management/repositories/IUserRepository';
import { AuthService } from '@domains/user-management/services/AuthService';
import { Email } from '@domains/user-management/value-objects/Email';
import { JwtService } from '@infrastructure/auth/JwtService';
import { User } from '@domains/user-management/entities/User';

/**
 * Caso de Uso: LoginUseCase
 * 
 * RAZÓN DE DISEÑO:
 * - Orquesta el flujo de login
 * - Verifica credenciales y genera token JWT
 * - Retorna DTOs para la capa de presentación
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    walletAddress: string | null;
  };
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    // Validar email
    const email = Email.create(request.email);

    // Buscar usuario
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verificar contraseña
    const isValid = await this.authService.verifyPassword(request.password, user);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Generar token JWT
    const token = this.jwtService.generateToken(user.getId(), user.getEmail().getValue());

    // Retornar DTO
    return {
      token,
      user: {
        id: user.getId().toString(),
        email: user.getEmail().getValue(),
        username: user.getUsername().getValue(),
        walletAddress: user.getWalletAddress(),
      },
    };
  }
}

