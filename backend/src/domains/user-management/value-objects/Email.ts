/**
 * Value Object: Email
 * 
 * RAZÓN DE DISEÑO:
 * - Encapsula validación de email
 * - Inmutable (no puede cambiar después de creación)
 * - Reutilizable en todo el dominio
 * - Type-safe
 * 
 * PRINCIPIOS:
 * - Value Object: Inmutable, comparado por valor
 * - Single Responsibility: Solo valida formato de email
 */
export class Email {
  private constructor(private readonly value: string) {}

  /**
   * Crea un Email validado
   * @throws Error si el email no es válido
   */
  static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    // Validación básica de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error(`Invalid email format: ${email}`);
    }

    // Normalizar: lowercase y trim
    const normalizedEmail = email.trim().toLowerCase();

    // Validar longitud
    if (normalizedEmail.length > 255) {
      throw new Error('Email is too long (max 255 characters)');
    }

    return new Email(normalizedEmail);
  }

  /**
   * Obtiene el valor del email
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compara dos emails por valor
   */
  equals(other: Email): boolean {
    return this.value === other.value;
  }

  /**
   * String representation
   */
  toString(): string {
    return this.value;
  }
}

