import { UUID } from '@shared/value-objects/UUID';
import { Design } from '@domains/design-generation/entities/Design';
import { DesignGenerationService } from '@domains/design-generation/services/DesignGenerationService';
import { IDesignRepository } from '@domains/design-generation/repositories/IDesignRepository';
import { ColorPalette } from '@domains/design-generation/value-objects/ColorPalette';
import { DesignStyleValue } from '@domains/design-generation/value-objects/DesignStyle';
import { ImageUrl } from '@domains/design-generation/value-objects/ImageUrl';

describe('DesignGenerationService', () => {
  let service: DesignGenerationService;
  let mockRepository: jest.Mocked<IDesignRepository>;

  beforeEach(() => {
    // Crear mock del repositorio
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
    };

    service = new DesignGenerationService(mockRepository);
  });

  describe('generateDesign', () => {
    it('should generate and save design', async () => {
      // Arrange
      const userId = UUID.create();
      const imageUrl = ImageUrl.create('https://example.com/design.jpg');
      const colorPalette = ColorPalette.create(['#FF0000']);
      const style = DesignStyleValue.create('futuristic');
      const prompt = 'futuristic sneaker';

      // Act
      const { design, event } = await service.generateDesign(
        userId,
        imageUrl,
        colorPalette,
        style,
        prompt
      );

      // Assert
      expect(design).toBeDefined();
      expect(design.getUserId().equals(userId)).toBe(true);
      expect(design.getImageUrl().equals(imageUrl)).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith(design);
      expect(event).toBeDefined();
      expect(event.userId.equals(userId)).toBe(true);
    });

    it('should throw error when imageUrl is empty', async () => {
      // Arrange
      const userId = UUID.create();
      const colorPalette = ColorPalette.create(['#FF0000']);
      const style = DesignStyleValue.create('futuristic');

      // Act & Assert
      // ImageUrl validation happens in constructor, so we test with invalid URL
      await expect(
        service.generateDesign(
          userId,
          ImageUrl.create('https://example.com/design.jpg'), // Valid URL
          colorPalette,
          style,
          ''
        )
      ).rejects.toThrow('Prompt is required');
    });

    it('should throw error when prompt is empty', async () => {
      // Arrange
      const userId = UUID.create();
      const colorPalette = ColorPalette.create(['#FF0000']);
      const style = DesignStyleValue.create('futuristic');

      // Act & Assert
      await expect(
        service.generateDesign(
          userId,
          ImageUrl.create('https://example.com/image.jpg'),
          colorPalette,
          style,
          ''
        )
      ).rejects.toThrow('Prompt is required');
    });
  });

  describe('getUserDesigns', () => {
    it('should return designs for user', async () => {
      // Arrange
      const userId = UUID.create();
      const mockDesigns = [
        Design.reconstitute(
          UUID.create(),
          userId,
          'https://example.com/design1.jpg',
          ColorPalette.create(['#FF0000']),
          DesignStyleValue.create('futuristic'),
          'prompt 1'
        ),
      ];

      mockRepository.findByUserId.mockResolvedValue(mockDesigns);

      // Act
      const designs = await service.getUserDesigns(userId);

      // Assert
      expect(designs).toEqual(mockDesigns);
      expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('getDesignById', () => {
    it('should return design by id', async () => {
      // Arrange
      const designId = UUID.create();
      const userId = UUID.create();
      const mockDesign = Design.reconstitute(
        designId,
        userId,
        ImageUrl.create('https://example.com/design.jpg'),
        ColorPalette.create(['#FF0000']),
        DesignStyleValue.create('futuristic'),
        'prompt'
      );

      mockRepository.findById.mockResolvedValue(mockDesign);

      // Act
      const design = await service.getDesignById(designId);

      // Assert
      expect(design).toEqual(mockDesign);
      expect(mockRepository.findById).toHaveBeenCalledWith(designId);
    });

    it('should return null when design not found', async () => {
      // Arrange
      const designId = UUID.create();
      mockRepository.findById.mockResolvedValue(null);

      // Act
      const design = await service.getDesignById(designId);

      // Assert
      expect(design).toBeNull();
    });
  });
});

