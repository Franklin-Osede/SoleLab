/**
 * Value Object: PasswordHash
 * 
 * RAZÓN DE DISEÑO:
 * - Encapsula el hash de contraseña
 * - Nunca almacena contraseñas en texto plano
 * - Inmutable
 * 
 * NOTA: Este Value Object solo almacena el hash, no genera ni valida
 * La generación del hash se hace en el servicio de dominio
 */
export class PasswordHash {
  private constructor(private readonly value: string) {}

  /**
   * Crea un PasswordHash (solo para reconstituciones)
   * NO valida ni genera el hash, solo lo almacena
   */
  static fromHash(hash: string): PasswordHash {
    if (!hash || hash.trim().length === 0) {
      throw new Error('Password hash cannot be empty');
    }

    return new PasswordHash(hash);
  }

  /**
   * Obtiene el hash
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compara dos hashes
   */
  equals(other: PasswordHash): boolean {
    return this.value === other.value;
  }

  /**
   * String representation (solo para logging, nunca exponer)
   */
  toString(): string {
    return '[PasswordHash]';
  }
}

