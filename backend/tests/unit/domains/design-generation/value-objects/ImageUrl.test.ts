/// <reference types="jest" />
import { ImageUrl } from '@domains/design-generation/value-objects/ImageUrl';

describe('ImageUrl', () => {
  describe('create', () => {
    it('should create valid HTTP URL', () => {
      // Arrange
      const url = 'http://example.com/image.jpg';

      // Act
      const imageUrl = ImageUrl.create(url);

      // Assert
      expect(imageUrl).toBeDefined();
      expect(imageUrl.getValue()).toBe(url);
    });

    it('should create valid HTTPS URL', () => {
      // Arrange
      const url = 'https://example.com/image.png';

      // Act
      const imageUrl = ImageUrl.create(url);

      // Assert
      expect(imageUrl).toBeDefined();
      expect(imageUrl.getValue()).toBe(url);
    });

    it('should create URL without image extension (API/CDN)', () => {
      // Arrange
      const url = 'https://api.example.com/images/123';

      // Act
      const imageUrl = ImageUrl.create(url);

      // Assert
      expect(imageUrl).toBeDefined();
      expect(imageUrl.getValue()).toBe(url);
    });

    it('should throw error for empty URL', () => {
      // Act & Assert
      expect(() => ImageUrl.create('')).toThrow('Image URL cannot be empty');
      expect(() => ImageUrl.create('   ')).toThrow('Image URL cannot be empty');
    });

    it('should throw error for invalid URL format', () => {
      // Act & Assert
      expect(() => ImageUrl.create('not-a-url')).toThrow();
      expect(() => ImageUrl.create('ftp://example.com/image.jpg')).toThrow(
        'Image URL must use HTTP or HTTPS protocol'
      );
    });

    it('should throw error for non-HTTP protocols', () => {
      // Act & Assert
      expect(() => ImageUrl.create('ftp://example.com/image.jpg')).toThrow(
        'Image URL must use HTTP or HTTPS protocol'
      );
      expect(() => ImageUrl.create('file:///path/to/image.jpg')).toThrow(
        'Image URL must use HTTP or HTTPS protocol'
      );
    });
  });

  describe('getValue', () => {
    it('should return URL value', () => {
      // Arrange
      const url = 'https://example.com/image.jpg';
      const imageUrl = ImageUrl.create(url);

      // Act
      const value = imageUrl.getValue();

      // Assert
      expect(value).toBe(url);
    });
  });

  describe('toString', () => {
    it('should return URL as string', () => {
      // Arrange
      const url = 'https://example.com/image.jpg';
      const imageUrl = ImageUrl.create(url);

      // Act
      const stringValue = imageUrl.toString();

      // Assert
      expect(stringValue).toBe(url);
    });
  });

  describe('equals', () => {
    it('should return true for same URLs', () => {
      // Arrange
      const url = 'https://example.com/image.jpg';
      const imageUrl1 = ImageUrl.create(url);
      const imageUrl2 = ImageUrl.create(url);

      // Act
      const result = imageUrl1.equals(imageUrl2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for different URLs', () => {
      // Arrange
      const imageUrl1 = ImageUrl.create('https://example.com/image1.jpg');
      const imageUrl2 = ImageUrl.create('https://example.com/image2.jpg');

      // Act
      const result = imageUrl1.equals(imageUrl2);

      // Assert
      expect(result).toBe(false);
    });
  });
});

