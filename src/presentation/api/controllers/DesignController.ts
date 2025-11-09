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
      const body = request.body as {
        userId: string;
        basePrompt: string;
        style: string;
        colors: string[];
      };

      // Validación básica (puedes usar Zod para más validación)
      if (!body.userId || !body.basePrompt || !body.style || !body.colors) {
        return reply.status(400).send({
          error: 'Missing required fields: userId, basePrompt, style, colors',
        });
      }

      // Llamar caso de uso
      const result = await this.generateDesignUseCase.execute({
        userId: body.userId,
        basePrompt: body.basePrompt,
        style: body.style,
        colors: body.colors,
      });

      return reply.status(201).send(result);
    } catch (error) {
      return reply.status(500).send({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  /**
   * GET /api/v1/designs/:id
   * Obtiene un diseño por ID
   */
  async getDesignById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as { id: string };
      const designId = UUID.fromString(params.id);

      const design = await this.designGenerationService.getDesignById(designId);

      if (!design) {
        return reply.status(404).send({ error: 'Design not found' });
      }

      // Convertir a DTO
      return reply.status(200).send({
        id: design.getId().toString(),
        userId: design.getUserId().toString(),
        imageUrl: design.getImageUrl(),
        style: design.getStyle().toString(),
        colors: design.getColorPalette().getColors(),
        prompt: design.getPrompt(),
        metadataUri: design.getMetadataUri(),
        tokenId: design.getTokenId(),
        createdAt: design.getCreatedAt(),
      });
    } catch (error) {
      return reply.status(500).send({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  /**
   * GET /api/v1/designs/user/:userId
   * Obtiene todos los diseños de un usuario
   */
  async getUserDesigns(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as { userId: string };
      const userId = UUID.fromString(params.userId);

      const designs = await this.designGenerationService.getUserDesigns(userId);

      // Convertir a DTOs
      const dtos = designs.map((design) => ({
        id: design.getId().toString(),
        userId: design.getUserId().toString(),
        imageUrl: design.getImageUrl(),
        style: design.getStyle().toString(),
        colors: design.getColorPalette().getColors(),
        prompt: design.getPrompt(),
        createdAt: design.getCreatedAt(),
      }));

      return reply.status(200).send(dtos);
    } catch (error) {
      return reply.status(500).send({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  /**
   * GET /api/v1/designs
   * Lista todos los diseños
   */
  async getAllDesigns(request: FastifyRequest, reply: FastifyReply) {
    try {
      // TODO: Implementar en servicio
      return reply.status(200).send({ message: 'Not implemented yet' });
    } catch (error) {
      return reply.status(500).send({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
}

