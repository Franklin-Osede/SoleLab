import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DesignController } from '../controllers/DesignController';
import { container } from '../../../infrastructure/dependency-injection/container';
import { validateRequest } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { GenerateDesignSchema, GetDesignByIdSchema, GetUserDesignsSchema } from '../schemas/design.schemas';

/**
 * Routes para Design
 * 
 * RAZÓN DE DISEÑO:
 * - Routes solo definen endpoints, no lógica
 * - Lógica en controllers
 * - Dependency injection desde container
 */
export async function designRoutes(fastify: FastifyInstance) {
  const designController = container.get<DesignController>('DesignController');

  // POST /api/v1/designs - Generar nuevo diseño (requiere autenticación)
  fastify.post(
    '/',
    {
      preHandler: [authMiddleware, validateRequest(GenerateDesignSchema)],
      schema: {
        description: 'Generate a new sneaker design using AI',
        tags: ['designs'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['basePrompt', 'style', 'colors'],
          properties: {
            basePrompt: { type: 'string', minLength: 1, maxLength: 500 },
            style: { type: 'string', enum: ['futuristic', 'retro', 'minimalist', 'sporty', 'luxury', 'streetwear'] },
            colors: { type: 'array', items: { type: 'string', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' } },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              designId: { type: 'string' },
              imageUrl: { type: 'string' },
              prompt: { type: 'string' },
              style: { type: 'string' },
              colors: { type: 'array', items: { type: 'string' } },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return designController.generateDesign(request, reply);
    }
  );

  // GET /api/v1/designs/:id - Obtener diseño por ID (requiere autenticación)
  fastify.get(
    '/:id',
    { 
      preHandler: [authMiddleware, validateRequest(GetDesignByIdSchema)],
      schema: {
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return designController.getDesignById(request, reply);
    }
  );

  // GET /api/v1/designs/user/:userId - Obtener diseños de usuario (requiere autenticación)
  fastify.get(
    '/user/:userId',
    { 
      preHandler: [authMiddleware, validateRequest(GetUserDesignsSchema)],
      schema: {
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return designController.getUserDesigns(request, reply);
    }
  );

  // GET /api/v1/designs - Listar todos los diseños (requiere autenticación)
  fastify.get(
    '/',
    {
      preHandler: [authMiddleware],
      schema: {
        description: 'List all designs with pagination and filters',
        tags: ['designs'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            pageSize: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            style: { type: 'string', enum: ['futuristic', 'retro', 'minimalist', 'sporty', 'luxury', 'streetwear'] },
            userId: { type: 'string', format: 'uuid' },
            createdAfter: { type: 'string', format: 'date-time' },
            createdBefore: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return designController.getAllDesigns(request, reply);
    }
  );
}

