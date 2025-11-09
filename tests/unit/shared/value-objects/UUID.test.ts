import { UUID } from '@shared/value-objects/UUID';

describe('UUID', () => {
  describe('create', () => {
    it('should create new UUID when no value provided', () => {
      // Act
      const uuid = UUID.create();

      // Assert
      expect(uuid).toBeDefined();
      expect(uuid.toString().length).toBe(36); // UUID v4 format
    });

    it('should create UUID from string value', () => {
      // Arrange
      const uuidString = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const uuid = UUID.create(uuidString);

      // Assert
      expect(uuid.toString()).toBe(uuidString);
    });
  });

  describe('fromString', () => {
    it('should create UUID from valid string', () => {
      // Arrange
      const uuidString = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const uuid = UUID.fromString(uuidString);

      // Assert
      expect(uuid.toString()).toBe(uuidString);
    });

    it('should throw error for invalid UUID format', () => {
      // Arrange
      const invalidUuid = 'not-a-uuid';

      // Act & Assert
      expect(() => UUID.fromString(invalidUuid)).toThrow('Invalid UUID format');
    });

    it('should throw error for empty string', () => {
      // Act & Assert
      expect(() => UUID.fromString('')).toThrow('Invalid UUID format');
    });
  });

  describe('toString', () => {
    it('should return UUID as string', () => {
      // Arrange
      const uuidString = '123e4567-e89b-12d3-a456-426614174000';
      const uuid = UUID.fromString(uuidString);

      // Act
      const result = uuid.toString();

      // Assert
      expect(result).toBe(uuidString);
    });
  });

  describe('equals', () => {
    it('should return true for same UUIDs', () => {
      // Arrange
      const uuidString = '123e4567-e89b-12d3-a456-426614174000';
      const uuid1 = UUID.fromString(uuidString);
      const uuid2 = UUID.fromString(uuidString);

      // Act
      const result = uuid1.equals(uuid2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for different UUIDs', () => {
      // Arrange
      const uuid1 = UUID.fromString('123e4567-e89b-12d3-a456-426614174000');
      const uuid2 = UUID.fromString('123e4567-e89b-12d3-a456-426614174001');

      // Act
      const result = uuid1.equals(uuid2);

      // Assert
      expect(result).toBe(false);
    });
  });
});

