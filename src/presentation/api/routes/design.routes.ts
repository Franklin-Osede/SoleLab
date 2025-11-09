import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DesignController } from '../controllers/DesignController';
import { container } from '../../../infrastructure/dependency-injection/container';

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
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return designController.generateDesign(request, reply);
  });

  // GET /api/v1/designs/:id - Obtener diseño por ID
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    return designController.getDesignById(request, reply);
  });

  // GET /api/v1/designs/user/:userId - Obtener diseños de usuario
  fastify.get('/user/:userId', async (request: FastifyRequest, reply: FastifyReply) => {
    return designController.getUserDesigns(request, reply);
  });

  // GET /api/v1/designs - Listar todos los diseños
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return designController.getAllDesigns(request, reply);
  });
}

