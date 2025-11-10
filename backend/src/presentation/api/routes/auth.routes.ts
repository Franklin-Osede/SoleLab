import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';
import { z } from 'zod';

/**
 * Rutas de Autenticación
 * 
 * RAZÓN DE DISEÑO:
 * - Define endpoints de autenticación
 * - Valida schemas con Zod
 * - Conecta requests HTTP con controllers
 */

// Schemas de validación
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address').optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export async function authRoutes(
  fastify: FastifyInstance,
  options: { authController: AuthController }
) {
  const { authController } = options;

  /**
   * POST /api/v1/auth/register
   * Registra un nuevo usuario
   */
  fastify.post(
    '/register',
    {
      schema: {
        description: 'Register a new user',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'username', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            username: { type: 'string', minLength: 3, maxLength: 30 },
            password: { type: 'string', minLength: 8 },
            walletAddress: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  username: { type: 'string' },
                  walletAddress: { type: 'string', nullable: true },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      // Validar con Zod
      const validationResult = registerSchema.safeParse(request.body);
      if (!validationResult.success) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: validationResult.error.errors[0].message,
          details: validationResult.error.errors,
        });
      }

      return authController.register(request, reply);
    }
  );

  /**
   * POST /api/v1/auth/login
   * Inicia sesión
   */
  fastify.post(
    '/login',
    {
      schema: {
        description: 'Login user',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      username: { type: 'string' },
                      walletAddress: { type: 'string', nullable: true },
                    },
                  },
                },
              },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      // Validar con Zod
      const validationResult = loginSchema.safeParse(request.body);
      if (!validationResult.success) {
        return reply.status(400).send({
          error: 'Validation Error',
          message: validationResult.error.errors[0].message,
          details: validationResult.error.errors,
        });
      }

      return authController.login(request, reply);
    }
  );
}

