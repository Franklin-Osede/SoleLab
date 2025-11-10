import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUserUseCase } from '@application/use-cases/RegisterUserUseCase';
import { LoginUseCase } from '@application/use-cases/LoginUseCase';

/**
 * Controller de Autenticación
 * 
 * RAZÓN DE DISEÑO:
 * - Maneja requests HTTP de autenticación
 * - Valida inputs y llama a casos de uso
 * - Retorna respuestas HTTP apropiadas
 */
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  /**
   * POST /api/v1/auth/register
   * Registra un nuevo usuario
   */
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as {
        email: string;
        username: string;
        password: string;
        walletAddress?: string;
      };

      const result = await this.registerUserUseCase.execute({
        email: body.email,
        username: body.username,
        password: body.password,
        walletAddress: body.walletAddress,
      });

      return reply.status(201).send({
        data: result,
        message: 'User registered successfully',
      });
    } catch (error: any) {
      if (error.message.includes('already') || error.message.includes('taken')) {
        return reply.status(409).send({
          error: 'Conflict',
          message: error.message,
        });
      }

      if (error.message.includes('Invalid') || error.message.includes('must be')) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: error.message,
        });
      }

      throw error;
    }
  }

  /**
   * POST /api/v1/auth/login
   * Inicia sesión y retorna token JWT
   */
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as {
        email: string;
        password: string;
      };

      const result = await this.loginUseCase.execute({
        email: body.email,
        password: body.password,
      });

      return reply.status(200).send({
        data: result,
        message: 'Login successful',
      });
    } catch (error: any) {
      if (error.message.includes('Invalid email or password')) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: error.message,
        });
      }

      throw error;
    }
  }
}

