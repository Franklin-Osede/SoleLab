import { FastifyRequest, FastifyReply } from 'fastify';
import { GenerateDesignUseCase } from '../../../application/use-cases/GenerateDesignUseCase';
import { DesignGenerationService } from '../../../domains/design-generation/services/DesignGenerationService';
import { UUID } from '../../../shared/value-objects/UUID';

/**
 * Controller para Design
 * 
 * RAZÓN DE DISEÑO:
 * - Controllers manejan HTTP (request/response)
 * - Validan inputs HTTP
 * - Llaman a casos de uso
 * - Convierten errores a respuestas HTTP
 * - NO contienen lógica de negocio
 */
export class DesignController {
  constructor(
    private generateDesignUseCase: GenerateDesignUseCase,
    private designGenerationService: DesignGenerationService
  ) {}

  /**
   * POST /api/v1/designs
   * Genera un nuevo diseño
   */
  async generateDesign(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Los datos ya están validados por el middleware
      const validated = (request as any).validated;

      // Llamar caso de uso
      const result = await this.generateDesignUseCase.execute({
        userId: validated.userId,
        basePrompt: validated.basePrompt,
        style: validated.style,
        colors: validated.colors,
      });

      return reply.status(201).send(result);
    } catch (error) {
      // El error handler centralizado se encargará
      throw error;
    }
  }

  /**
   * GET /api/v1/designs/:id
   * Obtiene un diseño por ID
   */
  async getDesignById(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Los datos ya están validados por el middleware
      const validated = (request as any).validated;
      const designId = UUID.fromString(validated.id);

      const design = await this.designGenerationService.getDesignById(designId);

      if (!design) {
        throw new Error('Design not found');
      }

      // Convertir a DTO
      return reply.status(200).send({
        id: design.getId().toString(),
        userId: design.getUserId().toString(),
        imageUrl: design.getImageUrl().getValue(),
        style: design.getStyle().toString(),
        colors: design.getColorPalette().getColors(),
        prompt: design.getPrompt(),
        metadataUri: design.getMetadataUri(),
        tokenId: design.getTokenId(),
        createdAt: design.getCreatedAt(),
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET /api/v1/designs/user/:userId
   * Obtiene todos los diseños de un usuario
   */
  async getUserDesigns(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Los datos ya están validados por el middleware
      const validated = (request as any).validated;
      const userId = UUID.fromString(validated.userId);

      const designs = await this.designGenerationService.getUserDesigns(userId);

      // Convertir a DTOs
      const dtos = designs.map((design) => ({
        id: design.getId().toString(),
        userId: design.getUserId().toString(),
        imageUrl: design.getImageUrl().getValue(),
        style: design.getStyle().toString(),
        colors: design.getColorPalette().getColors(),
        prompt: design.getPrompt(),
        createdAt: design.getCreatedAt(),
      }));

      return reply.status(200).send(dtos);
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET /api/v1/designs
   * Lista todos los diseños (con paginación y filtros)
   */
  async getAllDesigns(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as {
        page?: string;
        pageSize?: string;
        style?: string;
        userId?: string;
        createdAfter?: string;
        createdBefore?: string;
      };

      const page = query.page ? parseInt(query.page, 10) : 1;
      const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;

      // Si hay filtros, usar búsqueda filtrada
      if (query.style || query.userId || query.createdAfter || query.createdBefore) {
        const filters: any = {};
        if (query.style) filters.style = query.style;
        if (query.userId) filters.userId = UUID.fromString(query.userId);
        if (query.createdAfter) filters.createdAfter = new Date(query.createdAfter);
        if (query.createdBefore) filters.createdBefore = new Date(query.createdBefore);

        const designs = await this.designGenerationService.searchDesigns(filters);
        
        const dtos = designs.map((design) => ({
          id: design.getId().toString(),
          userId: design.getUserId().toString(),
          imageUrl: design.getImageUrl().getValue(),
          style: design.getStyle().toString(),
          colors: design.getColorPalette().getColors(),
          prompt: design.getPrompt(),
          createdAt: design.getCreatedAt(),
        }));

        return reply.status(200).send({
          data: dtos,
          count: dtos.length,
        });
      }

      // Sin filtros, usar paginación
      const { designs, total } = await this.designGenerationService.getAllDesignsPaginated(page, pageSize);
      
      const dtos = designs.map((design) => ({
        id: design.getId().toString(),
        userId: design.getUserId().toString(),
        imageUrl: design.getImageUrl().getValue(),
        style: design.getStyle().toString(),
        colors: design.getColorPalette().getColors(),
        prompt: design.getPrompt(),
        createdAt: design.getCreatedAt(),
      }));

      return reply.status(200).send({
        data: dtos,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

