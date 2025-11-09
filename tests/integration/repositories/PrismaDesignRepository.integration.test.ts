import { PrismaClient } from '@prisma/client';
import { PrismaDesignRepository } from '@infrastructure/database/repositories/PrismaDesignRepository';
import { UUID } from '@shared/value-objects/UUID';
import { Design } from '@domains/design-generation/entities/Design';
import { ColorPalette } from '@domains/design-generation/value-objects/ColorPalette';
import { DesignStyleValue } from '@domains/design-generation/value-objects/DesignStyle';
import { ImageUrl } from '@domains/design-generation/value-objects/ImageUrl';

/**
 * Integration Tests para PrismaDesignRepository
 * 
 * RAZÓN DE DISEÑO:
 * - Tests con base de datos REAL (test DB)
 * - Verifica que la conversión dominio ↔ Prisma funciona
 * - Verifica queries reales
 * - Sigue TDD: Test primero, luego implementación
 * 
 * IMPORTANTE: Estos tests requieren una DB de test configurada
 */
describe('PrismaDesignRepository Integration', () => {
  let prisma: PrismaClient;
  let repository: PrismaDesignRepository;

  beforeAll(async () => {
    // Crear instancia de Prisma para tests
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
        },
      },
    });

    repository = new PrismaDesignRepository(prisma);

    // Limpiar DB antes de tests
    await prisma.design.deleteMany();
  });

  afterAll(async () => {
    // Limpiar después de tests
    await prisma.design.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Limpiar antes de cada test
    await prisma.design.deleteMany();
  });

  describe('save', () => {
    it('should save design to database', async () => {
      // Arrange
      const userId = UUID.create();
      const { design } = Design.create(
        userId,
        ImageUrl.create('https://example.com/design.jpg'),
        ColorPalette.create(['#FF0000', '#00FF00']),
        DesignStyleValue.create('futuristic'),
        'futuristic sneaker prompt'
      );

      // Act
      await repository.save(design);

      // Assert
      const saved = await prisma.design.findUnique({
        where: { id: design.getId().toString() },
      });

      expect(saved).toBeDefined();
      expect(saved?.id).toBe(design.getId().toString());
      expect(saved?.userId).toBe(design.getUserId().toString());
      expect(saved?.imageUrl).toBe(design.getImageUrl().getValue());
      expect(saved?.colors).toEqual(design.getColorPalette().getColors());
      expect(saved?.style).toBe(design.getStyle().toString());
    });

    it('should update existing design', async () => {
      // Arrange
      const userId = UUID.create();
      const { design: originalDesign } = Design.create(
        userId,
        ImageUrl.create('https://example.com/design1.jpg'),
        ColorPalette.create(['#FF0000']),
        DesignStyleValue.create('futuristic'),
        'original prompt'
      );

      await repository.save(originalDesign);

      // Modificar diseño (link NFT)
      originalDesign.linkNFT('ipfs://QmTest123', 1);

      // Act
      await repository.save(originalDesign);

      // Assert
      const updated = await prisma.design.findUnique({
        where: { id: originalDesign.getId().toString() },
      });

      expect(updated?.metadataUri).toBe('ipfs://QmTest123');
      expect(updated?.tokenId).toBe(1);
    });
  });

  describe('findById', () => {
    it('should find design by id', async () => {
      // Arrange
      const userId = UUID.create();
      const { design } = Design.create(
        userId,
        'https://example.com/design.jpg',
        ColorPalette.create(['#FF0000']),
        DesignStyleValue.create('futuristic'),
        'test prompt'
      );

      await repository.save(design);

      // Act
      const found = await repository.findById(design.getId());

      // Assert
      expect(found).toBeDefined();
      expect(found?.getId().equals(design.getId())).toBe(true);
      expect(found?.getImageUrl().equals(design.getImageUrl())).toBe(true);
      expect(found?.getColorPalette().equals(design.getColorPalette())).toBe(true);
    });

    it('should return null when design not found', async () => {
      // Arrange
      const nonExistentId = UUID.create();

      // Act
      const found = await repository.findById(nonExistentId);

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find all designs for a user', async () => {
      // Arrange
      const userId1 = UUID.create();
      const userId2 = UUID.create();

      const { design: design1 } = Design.create(
        userId1,
        ImageUrl.create('https://example.com/design1.jpg'),
        ColorPalette.create(['#FF0000']),
        DesignStyleValue.create('futuristic'),
        'prompt 1'
      );

      const { design: design2 } = Design.create(
        userId1,
        ImageUrl.create('https://example.com/design2.jpg'),
        ColorPalette.create(['#00FF00']),
        DesignStyleValue.create('retro'),
        'prompt 2'
      );

      const { design: design3 } = Design.create(
        userId2,
        ImageUrl.create('https://example.com/design3.jpg'),
        ColorPalette.create(['#0000FF']),
        DesignStyleValue.create('minimalist'),
        'prompt 3'
      );

      await repository.save(design1);
      await repository.save(design2);
      await repository.save(design3);

      // Act
      const userDesigns = await repository.findByUserId(userId1);

      // Assert
      expect(userDesigns).toHaveLength(2);
      expect(userDesigns.some((d) => d.getId().equals(design1.getId()))).toBe(true);
      expect(userDesigns.some((d) => d.getId().equals(design2.getId()))).toBe(true);
      expect(userDesigns.some((d) => d.getId().equals(design3.getId()))).toBe(false);
    });

    it('should return empty array when user has no designs', async () => {
      // Arrange
      const userId = UUID.create();

      // Act
      const designs = await repository.findByUserId(userId);

      // Assert
      expect(designs).toEqual([]);
    });
  });

  describe('findAll', () => {
    it('should find all designs', async () => {
      // Arrange
      const userId1 = UUID.create();
      const userId2 = UUID.create();

      const { design: design1 } = Design.create(
        userId1,
        ImageUrl.create('https://example.com/design1.jpg'),
        ColorPalette.create(['#FF0000']),
        DesignStyleValue.create('futuristic'),
        'prompt 1'
      );

      const { design: design2 } = Design.create(
        userId2,
        ImageUrl.create('https://example.com/design2.jpg'),
        ColorPalette.create(['#00FF00']),
        DesignStyleValue.create('retro'),
        'prompt 2'
      );

      await repository.save(design1);
      await repository.save(design2);

      // Act
      const allDesigns = await repository.findAll();

      // Assert
      expect(allDesigns.length).toBeGreaterThanOrEqual(2);
      expect(allDesigns.some((d) => d.getId().equals(design1.getId()))).toBe(true);
      expect(allDesigns.some((d) => d.getId().equals(design2.getId()))).toBe(true);
    });
  });

  describe('Domain ↔ Prisma Conversion', () => {
    it('should correctly convert domain entity to Prisma and back', async () => {
      // Arrange
      const userId = UUID.create();
      const colors = ['#FF0000', '#00FF00', '#0000FF'];
      const style = 'futuristic';
      const prompt = 'test prompt';
      const imageUrl = 'https://example.com/test.jpg';

      const { design: originalDesign } = Design.create(
        userId,
        ImageUrl.create(imageUrl),
        ColorPalette.create(colors),
        DesignStyleValue.create(style),
        prompt
      );

      // Act - Save (Domain → Prisma)
      await repository.save(originalDesign);

      // Act - Find (Prisma → Domain)
      const retrievedDesign = await repository.findById(originalDesign.getId());

      // Assert
      expect(retrievedDesign).toBeDefined();
      expect(retrievedDesign?.getId().equals(originalDesign.getId())).toBe(true);
      expect(retrievedDesign?.getUserId().equals(originalDesign.getUserId())).toBe(true);
      expect(retrievedDesign?.getImageUrl().equals(originalDesign.getImageUrl())).toBe(true);
      expect(retrievedDesign?.getColorPalette().equals(originalDesign.getColorPalette())).toBe(true);
      expect(retrievedDesign?.getStyle().equals(originalDesign.getStyle())).toBe(true);
      expect(retrievedDesign?.getPrompt()).toBe(originalDesign.getPrompt());
    });
  });
});

