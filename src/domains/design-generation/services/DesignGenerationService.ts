import { UUID } from '@shared/value-objects/UUID';
import { Design } from '../entities/Design';
import { ColorPalette } from '../value-objects/ColorPalette';
import { DesignStyleValue } from '../value-objects/DesignStyle';
import { ImageUrl } from '../value-objects/ImageUrl';
import { IDesignRepository } from '../repositories/IDesignRepository';
import { DesignGenerated } from '../events/DesignGenerated';

/**
 * Servicio de Dominio: DesignGenerationService
 * 
 * RAZÓN DE DISEÑO:
 * - Encapsula la lógica de negocio para generar diseños
 * - No depende de infraestructura (IA, storage) - solo interfaces
 * - Orquesta la creación de entidades y emisión de eventos
 * - Sigue el principio de Single Responsibility
 * 
 * PRINCIPIOS DDD:
 * - Ubicado en Domain Layer (sin dependencias externas)
 * - Usa interfaces de repositorios (Dependency Inversion)
 * - Emite eventos de dominio para comunicación asíncrona
 */
export class DesignGenerationService {
  constructor(private designRepository: IDesignRepository) {}

  /**
   * Genera un nuevo diseño
   * 
   * @param userId - ID del usuario que genera el diseño
   * @param imageUrl - URL de la imagen generada (viene de infraestructura)
   * @param colorPalette - Paleta de colores del diseño
   * @param style - Estilo del diseño
   * @param prompt - Prompt usado para generar
   * @returns El diseño creado y el evento emitido
   */
  async generateDesign(
    userId: UUID,
    imageUrl: ImageUrl,
    colorPalette: ColorPalette,
    style: DesignStyleValue,
    prompt: string
  ): Promise<{ design: Design; event: DesignGenerated }> {
    // Validación de negocio
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    // Crear entidad usando factory method
    // ImageUrl ya valida la URL en su constructor
    const { design, event } = Design.create(userId, imageUrl, colorPalette, style, prompt);

    // Validar diseño antes de persistir
    if (!design.isValid()) {
      throw new Error('Generated design is invalid');
    }

    // Persistir (el repositorio se encarga de la implementación)
    await this.designRepository.save(design);

    return { design, event };
  }

  /**
   * Obtiene todos los diseños de un usuario
   */
  async getUserDesigns(userId: UUID): Promise<Design[]> {
    return this.designRepository.findByUserId(userId);
  }

  /**
   * Obtiene un diseño por ID
   */
  async getDesignById(designId: UUID): Promise<Design | null> {
    return this.designRepository.findById(designId);
  }

  /**
   * Obtiene todos los diseños
   */
  async getAllDesigns(): Promise<Design[]> {
    return this.designRepository.findAll();
  }

  /**
   * Obtiene diseños con paginación
   */
  async getAllDesignsPaginated(page: number, pageSize: number): Promise<{ designs: Design[]; total: number }> {
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (pageSize < 1 || pageSize > 100) {
      throw new Error('Page size must be between 1 and 100');
    }

    return this.designRepository.findAllPaginated(page, pageSize);
  }
}

