/**
 * Interface: IAIService
 * 
 * RAZÓN DE DISEÑO:
 * - Define contrato para servicios de IA sin acoplar a implementación específica
 * - Permite cambiar de Stable Diffusion a otra IA sin modificar dominio
 * - Facilita testing con mocks
 * - Sigue Dependency Inversion Principle
 * 
 * UBICACIÓN:
 * - En Infrastructure Layer porque es una preocupación técnica
 * - Pero la interface está aquí para que Domain/Application la usen
 */
export interface IAIService {
  /**
   * Genera una imagen usando IA
   * 
   * @param prompt - Prompt positivo
   * @param negativePrompt - Prompt negativo (lo que no queremos)
   * @returns URL de la imagen generada
   */
  generateImage(prompt: string, negativePrompt: string): Promise<string>;

  /**
   * Genera múltiples variaciones de una imagen
   * 
   * @param prompt - Prompt base
   * @param count - Número de variaciones
   * @returns URLs de las imágenes generadas
   */
  generateVariations(prompt: string, count: number): Promise<string[]>;
}

