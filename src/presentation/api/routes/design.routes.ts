import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DesignController } from '../controllers/DesignController';
import { container } from '../../../infrastructure/dependency-injection/container';
import { validateRequest } from '../middleware/validation.middleware';
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

  // POST /api/v1/designs - Generar nuevo diseño
  fastify.post(
    '/',
    {
      preHandler: validateRequest(GenerateDesignSchema),
      schema: {
        description: 'Generate a new sneaker design using AI',
        tags: ['designs'],
        body: {
          type: 'object',
          required: ['userId', 'basePrompt', 'style', 'colors'],
          properties: {
            userId: { type: 'string', format: 'uuid' },
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

  // GET /api/v1/designs/:id - Obtener diseño por ID
  fastify.get(
    '/:id',
    { preHandler: validateRequest(GetDesignByIdSchema) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return designController.getDesignById(request, reply);
    }
  );

  // GET /api/v1/designs/user/:userId - Obtener diseños de usuario
  fastify.get(
    '/user/:userId',
    { preHandler: validateRequest(GetUserDesignsSchema) },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return designController.getUserDesigns(request, reply);
    }
  );

  // GET /api/v1/designs - Listar todos los diseños (con paginación)
  fastify.get(
    '/',
    {
      schema: {
        description: 'List all designs with pagination',
        tags: ['designs'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            pageSize: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return designController.getAllDesigns(request, reply);
    }
  );
}

