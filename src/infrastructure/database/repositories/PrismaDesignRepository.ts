import { UUID } from '@shared/value-objects/UUID';
import { Design } from '@domains/design-generation/entities/Design';
import { IDesignRepository } from '@domains/design-generation/repositories/IDesignRepository';
import { ColorPalette } from '@domains/design-generation/value-objects/ColorPalette';
import { DesignStyleValue } from '@domains/design-generation/value-objects/DesignStyle';
import { ImageUrl } from '@domains/design-generation/value-objects/ImageUrl';
import { PrismaClient } from '@prisma/client';

/**
 * Implementación: PrismaDesignRepository
 * 
 * RAZÓN DE DISEÑO:
 * - Implementación concreta de IDesignRepository usando Prisma
 * - Convierte entre entidades de dominio y modelos de base de datos
 * - Encapsula detalles de persistencia
 * - Puede ser reemplazada por otra implementación (MongoDB, etc.)
 * 
 * PRINCIPIOS:
 * - Repository Pattern: Abstrae acceso a datos
 * - Dependency Inversion: Implementa interface del dominio
 * - Separation of Concerns: Solo se encarga de persistencia
 */
export class PrismaDesignRepository implements IDesignRepository {
  constructor(private prisma: PrismaClient) {}

  async save(design: Design): Promise<void> {
    // Convertir entidad de dominio a modelo de Prisma
    const designData = {
      id: design.getId().toString(),
      userId: design.getUserId().toString(),
      imageUrl: design.getImageUrl().getValue(),
      colors: design.getColorPalette().getColors(),
      style: design.getStyle().toString(),
      prompt: design.getPrompt(),
      metadataUri: design.getMetadataUri(),
      tokenId: design.getTokenId(),
      createdAt: design.getCreatedAt(),
    };

    // Upsert: crear o actualizar
    await this.prisma.design.upsert({
      where: { id: designData.id },
      create: designData,
      update: designData,
    });
  }

  async findById(id: UUID): Promise<Design | null> {
    const designData = await this.prisma.design.findUnique({
      where: { id: id.toString() },
    });

    if (!designData) {
      return null;
    }

    // Convertir modelo de Prisma a entidad de dominio
    return this.toDomainEntity(designData);
  }

  async findByUserId(userId: UUID): Promise<Design[]> {
    const designsData = await this.prisma.design.findMany({
      where: { userId: userId.toString() },
      orderBy: { createdAt: 'desc' },
    });

    return designsData.map((data) => this.toDomainEntity(data));
  }

  async findAll(): Promise<Design[]> {
    const designsData = await this.prisma.design.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return designsData.map((data) => this.toDomainEntity(data));
  }

  async findAllPaginated(page: number, pageSize: number): Promise<{ designs: Design[]; total: number }> {
    const skip = (page - 1) * pageSize;

    const [designsData, total] = await Promise.all([
      this.prisma.design.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.design.count(),
    ]);

    return {
      designs: designsData.map((data) => this.toDomainEntity(data)),
      total,
    };
  }

  async findByFilters(filters: {
    style?: string;
    userId?: UUID;
    createdAfter?: Date;
    createdBefore?: Date;
  }): Promise<Design[]> {
    const where: any = {};

    if (filters.style) {
      where.style = filters.style;
    }

    if (filters.userId) {
      where.userId = filters.userId.toString();
    }

    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {};
      if (filters.createdAfter) {
        where.createdAt.gte = filters.createdAfter;
      }
      if (filters.createdBefore) {
        where.createdAt.lte = filters.createdBefore;
      }
    }

    const designsData = await this.prisma.design.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return designsData.map((data) => this.toDomainEntity(data));
  }

  /**
   * Convierte modelo de Prisma a entidad de dominio
   * 
   * RAZÓN: Separar modelo de persistencia de modelo de dominio
   */
  private toDomainEntity(data: any): Design {
    return Design.reconstitute(
      UUID.fromString(data.id),
      UUID.fromString(data.userId),
      ImageUrl.create(data.imageUrl),
      ColorPalette.create(data.colors),
      DesignStyleValue.create(data.style),
      data.prompt,
      data.metadataUri,
      data.tokenId,
      data.createdAt
    );
  }
}

