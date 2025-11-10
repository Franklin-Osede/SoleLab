/// <reference types="jest" />
import { DesignStyleValue, DesignStyle } from '@domains/design-generation/value-objects/DesignStyle';

describe('DesignStyleValue', () => {
  describe('create', () => {
    it('should create valid design style', () => {
      // Arrange & Act
      const style = DesignStyleValue.create('futuristic');

      // Assert
      expect(style).toBeDefined();
      expect(style.getValue()).toBe(DesignStyle.FUTURISTIC);
    });

    it('should create all valid styles', () => {
      const styles = [
        'futuristic',
        'retro',
        'minimalist',
        'sporty',
        'luxury',
        'streetwear',
      ];

      styles.forEach((styleString) => {
        // Act
        const style = DesignStyleValue.create(styleString);

        // Assert
        expect(style).toBeDefined();
        expect(style.getValue()).toBeDefined();
      });
    });

    it('should be case insensitive', () => {
      // Arrange & Act
      const style1 = DesignStyleValue.create('FUTURISTIC');
      const style2 = DesignStyleValue.create('futuristic');
      const style3 = DesignStyleValue.create('Futuristic');

      // Assert
      expect(style1.getValue()).toBe(style2.getValue());
      expect(style2.getValue()).toBe(style3.getValue());
    });

    it('should throw error for invalid style', () => {
      // Act & Assert
      expect(() => DesignStyleValue.create('invalid-style')).toThrow(
        'Invalid design style: invalid-style'
      );
    });

    it('should throw error with list of valid styles', () => {
      // Act & Assert
      expect(() => DesignStyleValue.create('invalid')).toThrow();
      // Verificar que el mensaje contiene información útil
      try {
        DesignStyleValue.create('invalid');
      } catch (error: any) {
        expect(error.message).toContain('Invalid design style');
      }
    });
  });

  describe('toString', () => {
    it('should return style as string', () => {
      // Arrange
      const style = DesignStyleValue.create('futuristic');

      // Act
      const stringValue = style.toString();

      // Assert
      expect(stringValue).toBe('futuristic');
    });
  });

  describe('equals', () => {
    it('should return true for same styles', () => {
      // Arrange
      const style1 = DesignStyleValue.create('futuristic');
      const style2 = DesignStyleValue.create('futuristic');

      // Act
      const result = style1.equals(style2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for different styles', () => {
      // Arrange
      const style1 = DesignStyleValue.create('futuristic');
      const style2 = DesignStyleValue.create('retro');

      // Act
      const result = style1.equals(style2);

      // Assert
      expect(result).toBe(false);
    });
  });
});

