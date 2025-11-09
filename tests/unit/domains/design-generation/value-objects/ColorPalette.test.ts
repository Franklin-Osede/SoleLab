/// <reference types="jest" />
import { ColorPalette } from '@domains/design-generation/value-objects/ColorPalette';

describe('ColorPalette', () => {
  describe('create', () => {
    it('should create valid color palette with hex colors', () => {
      // Arrange
      const colors = ['#FF0000', '#00FF00', '#0000FF'];

      // Act
      const palette = ColorPalette.create(colors);

      // Assert
      expect(palette).toBeDefined();
      expect(palette.getColors()).toEqual(colors);
    });

    it('should create valid color palette with short hex colors', () => {
      // Arrange
      const colors = ['#F00', '#0F0', '#00F'];

      // Act
      const palette = ColorPalette.create(colors);

      // Assert
      expect(palette).toBeDefined();
      expect(palette.getColors()).toEqual(colors);
    });

    it('should throw error when colors array is empty', () => {
      // Arrange
      const colors: string[] = [];

      // Act & Assert
      expect(() => ColorPalette.create(colors)).toThrow(
        'Color palette must have at least one color'
      );
    });

    it('should throw error when colors array has more than 10 colors', () => {
      // Arrange
      const colors = Array(11).fill('#FF0000');

      // Act & Assert
      expect(() => ColorPalette.create(colors)).toThrow(
        'Color palette cannot have more than 10 colors'
      );
    });

    it('should throw error when color format is invalid', () => {
      // Arrange
      const colors = ['#FF0000', 'invalid-color', '#00FF00'];

      // Act & Assert
      expect(() => ColorPalette.create(colors)).toThrow(
        'Invalid color format: invalid-color. Must be hex color (e.g., #FF0000)'
      );
    });
  });

  describe('getPrimaryColor', () => {
    it('should return first color as primary', () => {
      // Arrange
      const colors = ['#FF0000', '#00FF00', '#0000FF'];
      const palette = ColorPalette.create(colors);

      // Act
      const primary = palette.getPrimaryColor();

      // Assert
      expect(primary).toBe('#FF0000');
    });
  });

  describe('getSecondaryColors', () => {
    it('should return all colors except first', () => {
      // Arrange
      const colors = ['#FF0000', '#00FF00', '#0000FF'];
      const palette = ColorPalette.create(colors);

      // Act
      const secondary = palette.getSecondaryColors();

      // Assert
      expect(secondary).toEqual(['#00FF00', '#0000FF']);
    });

    it('should return empty array when only one color', () => {
      // Arrange
      const colors = ['#FF0000'];
      const palette = ColorPalette.create(colors);

      // Act
      const secondary = palette.getSecondaryColors();

      // Assert
      expect(secondary).toEqual([]);
    });
  });

  describe('equals', () => {
    it('should return true for identical palettes', () => {
      // Arrange
      const colors = ['#FF0000', '#00FF00'];
      const palette1 = ColorPalette.create(colors);
      const palette2 = ColorPalette.create(colors);

      // Act
      const result = palette1.equals(palette2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for different palettes', () => {
      // Arrange
      const palette1 = ColorPalette.create(['#FF0000', '#00FF00']);
      const palette2 = ColorPalette.create(['#FF0000', '#0000FF']);

      // Act
      const result = palette1.equals(palette2);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for palettes with different lengths', () => {
      // Arrange
      const palette1 = ColorPalette.create(['#FF0000']);
      const palette2 = ColorPalette.create(['#FF0000', '#00FF00']);

      // Act
      const result = palette1.equals(palette2);

      // Assert
      expect(result).toBe(false);
    });
  });
});


