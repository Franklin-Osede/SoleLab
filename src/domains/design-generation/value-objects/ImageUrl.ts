/**
 * Value Object: ImageUrl
 * 
 * RAZÓN DE DISEÑO:
 * - Encapsula validación de URLs de imágenes
 * - Garantiza que siempre es una URL válida
 * - Inmutable una vez creado
 * - Comparación por valor
 * 
 * PRINCIPIOS:
 * - Value Object: Sin identidad, comparación por valor
 * - Inmutabilidad: No cambia después de crear
 * - Validación: Siempre válido o lanza error
 */
export class ImageUrl {
  private constructor(private value: string) {
    this.validate(value);
  }

  static create(url: string): ImageUrl {
    return new ImageUrl(url);
  }

  private validate(url: string): void {
    if (!url || url.trim().length === 0) {
      throw new Error('Image URL cannot be empty');
    }

    // Validar formato de URL
    try {
      const urlObj = new URL(url);
      
      // Validar que sea HTTP/HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Image URL must use HTTP or HTTPS protocol');
      }

      // Validar extensiones comunes de imagen (opcional, pero útil)
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasImageExtension = imageExtensions.some((ext) =>
        urlObj.pathname.toLowerCase().endsWith(ext)
      );

      // No requerimos extensión si es una URL de API/CDN
      // Pero validamos que al menos sea una URL válida
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Invalid URL format: ${url}`);
      }
      throw error;
    }
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: ImageUrl): boolean {
    return this.value === other.value;
  }
}

