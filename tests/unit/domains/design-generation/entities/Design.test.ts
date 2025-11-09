import { UUID } from '@shared/value-objects/UUID';
import { Design } from '@domains/design-generation/entities/Design';
import { ColorPalette } from '@domains/design-generation/value-objects/ColorPalette';
import { DesignStyleValue, DesignStyle } from '@domains/design-generation/value-objects/DesignStyle';
import { DesignGenerated } from '@domains/design-generation/events/DesignGenerated';

describe('Design', () => {
  describe('create', () => {
    it('should create design with valid data', () => {
      // Arrange
      const userId = UUID.create();
      const imageUrl = 'https://example.com/design.jpg';
      const colorPalette = ColorPalette.create(['#FF0000', '#00FF00']);
      const style = DesignStyleValue.create('futuristic');
      const prompt = 'futuristic sneaker with neon colors';

      // Act
      const { design, event } = Design.create(userId, imageUrl, colorPalette, style, prompt);

      // Assert
      expect(design).toBeDefined();
      expect(design.getId()).toBeDefined();
      expect(design.getUserId().equals(userId)).toBe(true);
      expect(design.getImageUrl()).toBe(imageUrl);
      expect(design.getColorPalette()).toBe(colorPalette);
      expect(design.getStyle()).toBe(style);
      expect(design.getPrompt()).toBe(prompt);
      expect(design.isValid()).toBe(true);

      // Event assertions
      expect(event).toBeInstanceOf(DesignGenerated);
      expect(event.aggregateId.equals(design.getId())).toBe(true);
      expect(event.userId.equals(userId)).toBe(true);
      expect(event.imageUrl).toBe(imageUrl);
    });

    it('should create design with createdAt timestamp', () => {
      // Arrange
      const userId = UUID.create();
      const beforeCreation = new Date();

      // Act
      const { design } = Design.create(
        userId,
        'https://example.com/design.jpg',
        ColorPalette.create(['#FF0000']),
        DesignStyleValue.create('futuristic'),
        'test prompt'
      );

      const afterCreation = new Date();

      // Assert
      const createdAt = design.getCreatedAt();
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });
  });

  describe('linkNFT', () => {
    it('should link NFT metadata and tokenId to design', () => {
      // Arrange
      const { design } = Design.create(
        UUID.create(),
        'https://example.com/design.jpg',
        ColorPalette.create(['#FF0000']),
        DesignStyleValue.create('futuristic'),
        'test prompt'
      );
      const metadataUri = 'ipfs://Qm...';
      const tokenId = 123;

      // Act
      design.linkNFT(metadataUri, tokenId);

      // Assert
      expect(design.getMetadataUri()).toBe(metadataUri);
      expect(design.getTokenId()).toBe(tokenId);
    });
  });

  describe('isValid', () => {
    it('should return true for valid design', () => {
      // Arrange
      const { design } = Design.create(
        UUID.create(),
        'https://example.com/design.jpg',
        ColorPalette.create(['#FF0000']),
        DesignStyleValue.create('futuristic'),
        'test prompt'
      );

      // Act
      const isValid = design.isValid();

      // Assert
      expect(isValid).toBe(true);
    });

    it('should return false for design with empty imageUrl', () => {
      // Arrange
      const { design } = Design.create(
        UUID.create(),
        '',
        ColorPalette.create(['#FF0000']),
        DesignStyleValue.create('futuristic'),
        'test prompt'
      );

      // Act
      const isValid = design.isValid();

      // Assert
      expect(isValid).toBe(false);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute design from persistence', () => {
      // Arrange
      const id = UUID.create();
      const userId = UUID.create();
      const imageUrl = 'https://example.com/design.jpg';
      const colorPalette = ColorPalette.create(['#FF0000']);
      const style = DesignStyleValue.create('futuristic');
      const prompt = 'test prompt';
      const metadataUri = 'ipfs://Qm...';
      const tokenId = 123;
      const createdAt = new Date('2024-01-01');

      // Act
      const design = Design.reconstitute(
        id,
        userId,
        imageUrl,
        colorPalette,
        style,
        prompt,
        metadataUri,
        tokenId,
        createdAt
      );

      // Assert
      expect(design.getId().equals(id)).toBe(true);
      expect(design.getUserId().equals(userId)).toBe(true);
      expect(design.getImageUrl()).toBe(imageUrl);
      expect(design.getMetadataUri()).toBe(metadataUri);
      expect(design.getTokenId()).toBe(tokenId);
      expect(design.getCreatedAt()).toEqual(createdAt);
    });
  });
});


