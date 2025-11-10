import { UUID } from '@shared/value-objects/UUID';
import { Design } from '@domains/design-generation/entities/Design';
import { ColorPalette } from '@domains/design-generation/value-objects/ColorPalette';
import { DesignStyleValue } from '@domains/design-generation/value-objects/DesignStyle';
import { ImageUrl } from '@domains/design-generation/value-objects/ImageUrl';
import { DesignGenerationService } from '@domains/design-generation/services/DesignGenerationService';
import { PromptBuilderService } from '@domains/design-generation/services/PromptBuilderService';
import { IAIService } from '@infrastructure/ai/IAIService';
import { DesignGenerated } from '@domains/design-generation/events/DesignGenerated';

/**
 * Caso de Uso: GenerateDesignUseCase
 * 
 * RAZÓN DE DISEÑO:
 * - Orquesta el flujo completo de generación de diseño
 * - Conecta Domain Layer con Infrastructure Layer
 * - Maneja DTOs (Data Transfer Objects) para la capa de presentación
 * - Coordina múltiples servicios de dominio
 * 
 * PRINCIPIOS:
 * - Application Layer orquesta, no contiene lógica de negocio
 * - Usa servicios de dominio para lógica de negocio
 * - Usa servicios de infraestructura para operaciones técnicas
 * - Retorna DTOs, no entidades de dominio
 */
export interface GenerateDesignRequest {
  userId: string;
  basePrompt: string;
  style: string;
  colors: string[];
}

export interface GenerateDesignResponse {
  designId: string;
  imageUrl: string;
  prompt: string;
  style: string;
  colors: string[];
  createdAt: Date;
}

export class GenerateDesignUseCase {
  constructor(
    private designGenerationService: DesignGenerationService,
    private promptBuilderService: PromptBuilderService,
    private aiService: IAIService
  ) {}

  /**
   * Ejecuta el caso de uso de generación de diseño
   * 
   * Flujo:
   * 1. Validar y convertir inputs a Value Objects
   * 2. Construir prompt optimizado
   * 3. Generar imagen con IA (infraestructura)
   * 4. Crear diseño usando servicio de dominio
   * 5. Retornar DTO para la capa de presentación
   */
  async execute(request: GenerateDesignRequest): Promise<GenerateDesignResponse> {
    // 1. Convertir inputs a Value Objects del dominio
    const userId = UUID.fromString(request.userId);
    const colorPalette = ColorPalette.create(request.colors);
    const style = DesignStyleValue.create(request.style);

    // 2. Construir prompt optimizado
    const optimizedPrompt = this.promptBuilderService.buildPrompt(
      request.basePrompt,
      style,
      colorPalette
    );
    const negativePrompt = this.promptBuilderService.buildNegativePrompt();

    // 3. Generar imagen con IA (infraestructura)
    const imageUrlString = await this.aiService.generateImage(optimizedPrompt, negativePrompt);
    const imageUrl = ImageUrl.create(imageUrlString);

    // 4. Crear diseño usando servicio de dominio
    const { design, event } = await this.designGenerationService.generateDesign(
      userId,
      imageUrl,
      colorPalette,
      style,
      optimizedPrompt
    );

    // 5. Convertir entidad de dominio a DTO
    return this.toDTO(design);
  }

  /**
   * Convierte entidad de dominio a DTO
   * 
   * RAZÓN: La capa de presentación no debe conocer entidades de dominio
   */
  private toDTO(design: Design): GenerateDesignResponse {
    return {
      designId: design.getId().toString(),
      imageUrl: design.getImageUrl().getValue(),
      prompt: design.getPrompt(),
      style: design.getStyle().toString(),
      colors: design.getColorPalette().getColors(),
      createdAt: design.getCreatedAt(),
    };
  }
}

