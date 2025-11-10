/**
 * Value Object: Username
 * 
 * RAZÓN DE DISEÑO:
 * - Encapsula validación de username
 * - Inmutable (no puede cambiar después de creación)
 * - Reutilizable en todo el dominio
 * - Type-safe
 * 
 * PRINCIPIOS:
 * - Value Object: Inmutable, comparado por valor
 * - Single Responsibility: Solo valida formato de username
 */
export class Username {
  private constructor(private readonly value: string) {}

  /**
   * Crea un Username validado
   * @throws Error si el username no es válido
   */
  static create(username: string): Username {
    if (!username || username.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }

    const trimmed = username.trim();

    // Validar longitud
    if (trimmed.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }

    if (trimmed.length > 30) {
      throw new Error('Username must be at most 30 characters');
    }

    // Validar formato: solo letras, números, guiones y guiones bajos
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmed)) {
      throw new Error('Username can only contain letters, numbers, hyphens and underscores');
    }

    return new Username(trimmed);
  }

  /**
   * Obtiene el valor del username
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compara dos usernames por valor
   */
  equals(other: Username): boolean {
    return this.value === other.value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this.value;
  }
}

