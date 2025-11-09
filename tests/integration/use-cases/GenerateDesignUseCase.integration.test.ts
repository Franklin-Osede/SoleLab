import { GenerateDesignUseCase } from '@application/use-cases/GenerateDesignUseCase';
import { DesignGenerationService } from '@domains/design-generation/services/DesignGenerationService';
import { PromptBuilderService } from '@domains/design-generation/services/PromptBuilderService';
import { PrismaDesignRepository } from '@infrastructure/database/repositories/PrismaDesignRepository';
import { StableDiffusionService } from '@infrastructure/ai/StableDiffusionService';
import { PrismaClient } from '@prisma/client';
import { UUID } from '@shared/value-objects/UUID';
import { ImageUrl } from '@domains/design-generation/value-objects/ImageUrl';

/**
 * Integration Tests para GenerateDesignUseCase
 * 
 * RAZÓN DE DISEÑO:
 * - Test del flujo completo: Use Case → Domain → Infrastructure
 * - Verifica integración entre capas
 * - Mock de servicios externos (IA) pero DB real
 * - Sigue TDD: Test primero
 */
describe('GenerateDesignUseCase Integration', () => {
  let prisma: PrismaClient;
  let repository: PrismaDesignRepository;
  let designGenerationService: DesignGenerationService;
  let promptBuilderService: PromptBuilderService;
  let mockAIService: jest.Mocked<StableDiffusionService>;
  let useCase: GenerateDesignUseCase;

  beforeAll(async () => {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
        },
      },
    });

    repository = new PrismaDesignRepository(prisma);
    await prisma.design.deleteMany();
  });

  afterAll(async () => {
    await prisma.design.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.design.deleteMany();

    // Mock AI Service
    mockAIService = {
      generateImage: jest.fn().mockResolvedValue('https://example.com/generated-image.jpg'),
      generateVariations: jest.fn().mockResolvedValue(['https://example.com/variation1.jpg']),
    } as any;

    // Setup services
    promptBuilderService = new PromptBuilderService();
    designGenerationService = new DesignGenerationService(repository);
    useCase = new GenerateDesignUseCase(
      designGenerationService,
      promptBuilderService,
      mockAIService
    );
  });

  describe('execute', () => {
    it('should generate design end-to-end', async () => {
      // Arrange
      const userId = UUID.create();
      const request = {
        userId: userId.toString(),
        basePrompt: 'futuristic sneaker',
        style: 'futuristic',
        colors: ['#FF0000', '#00FF00'],
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(result.designId).toBeDefined();
      expect(result.imageUrl).toBe('https://example.com/generated-image.jpg');
      expect(result.style).toBe('futuristic');
      expect(result.colors).toEqual(['#FF0000', '#00FF00']);
      expect(result.prompt).toContain('futuristic');
      expect(result.createdAt).toBeInstanceOf(Date);

      // Verificar que se guardó en DB
      const saved = await prisma.design.findUnique({
        where: { id: result.designId },
      });
      expect(saved).toBeDefined();
      expect(saved?.imageUrl).toBe(result.imageUrl);

      // Verificar que se llamó al servicio de IA
      expect(mockAIService.generateImage).toHaveBeenCalled();
    });

    it('should build optimized prompt', async () => {
      // Arrange
      const userId = UUID.create();
      const request = {
        userId: userId.toString(),
        basePrompt: 'sneaker',
        style: 'futuristic',
        colors: ['#FF0000'],
      };

      // Act
      await useCase.execute(request);

      // Assert
      expect(mockAIService.generateImage).toHaveBeenCalled();
      const callArgs = mockAIService.generateImage.mock.calls[0];
      const prompt = callArgs[0];
      const negativePrompt = callArgs[1];

      expect(prompt).toContain('sneaker');
      expect(prompt).toContain('futuristic');
      expect(prompt).toContain('primary color #FF0000');
      expect(prompt).toContain('high quality');
      expect(negativePrompt).toContain('blurry');
    });

    it('should handle AI service errors', async () => {
      // Arrange
      const userId = UUID.create();
      mockAIService.generateImage.mockRejectedValue(new Error('AI service unavailable'));

      const request = {
        userId: userId.toString(),
        basePrompt: 'sneaker',
        style: 'futuristic',
        colors: ['#FF0000'],
      };

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('AI service unavailable');
    });
  });
});

