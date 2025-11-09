import { PromptBuilderService } from '@domains/design-generation/services/PromptBuilderService';
import { ColorPalette } from '@domains/design-generation/value-objects/ColorPalette';
import { DesignStyleValue, DesignStyle } from '@domains/design-generation/value-objects/DesignStyle';

describe('PromptBuilderService', () => {
  let service: PromptBuilderService;

  beforeEach(() => {
    service = new PromptBuilderService();
  });

  describe('buildPrompt', () => {
    it('should build prompt with style and colors', () => {
      // Arrange
      const basePrompt = 'futuristic sneaker';
      const style = DesignStyleValue.create('futuristic');
      const colorPalette = ColorPalette.create(['#FF0000', '#00FF00']);

      // Act
      const prompt = service.buildPrompt(basePrompt, style, colorPalette);

      // Assert
      expect(prompt).toContain(basePrompt);
      expect(prompt).toContain('futuristic');
      expect(prompt).toContain('primary color #FF0000');
      expect(prompt).toContain('accent colors #00FF00');
      expect(prompt).toContain('high quality');
      expect(prompt).toContain('sneaker');
    });

    it('should include quality prompts', () => {
      // Arrange
      const basePrompt = 'test';
      const style = DesignStyleValue.create('minimalist');
      const colorPalette = ColorPalette.create(['#000000']);

      // Act
      const prompt = service.buildPrompt(basePrompt, style, colorPalette);

      // Assert
      expect(prompt).toContain('high quality');
      expect(prompt).toContain('detailed');
      expect(prompt).toContain('professional');
    });

    it('should handle different styles correctly', () => {
      // Arrange
      const basePrompt = 'sneaker';
      const colorPalette = ColorPalette.create(['#FF0000']);

      const styles = [
        { style: DesignStyle.FUTURISTIC, expected: 'futuristic' },
        { style: DesignStyle.RETRO, expected: 'retro' },
        { style: DesignStyle.MINIMALIST, expected: 'minimalist' },
        { style: DesignStyle.SPORTY, expected: 'sporty' },
        { style: DesignStyle.LUXURY, expected: 'luxury' },
        { style: DesignStyle.STREETWEAR, expected: 'streetwear' },
      ];

      styles.forEach(({ style, expected }) => {
        // Act
        const styleValue = DesignStyleValue.create(style);
        const prompt = service.buildPrompt(basePrompt, styleValue, colorPalette);

        // Assert
        expect(prompt).toContain(expected);
      });
    });
  });

  describe('buildNegativePrompt', () => {
    it('should build negative prompt with common exclusions', () => {
      // Act
      const negativePrompt = service.buildNegativePrompt();

      // Assert
      expect(negativePrompt).toContain('blurry');
      expect(negativePrompt).toContain('low quality');
      expect(negativePrompt).toContain('watermark');
      expect(negativePrompt).toContain('text');
    });
  });
});

