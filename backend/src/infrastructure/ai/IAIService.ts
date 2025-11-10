/**
 * Interface: IAIService
 * 
 * RAZÓN DE DISEÑO:
 * - Abstracción para servicios de IA
 * - Permite cambiar implementación (Stable Diffusion, DALL-E, etc.)
 * - Facilita testing con mocks
 * - Dependency Inversion Principle
 */
export interface IAIService {
  /**
   * Genera una imagen basada en un prompt
   * 
   * @param prompt - Prompt para generar la imagen
   * @param negativePrompt - Prompt negativo (qué evitar)
   * @returns URL de la imagen generada
   */
  generateImage(prompt: string, negativePrompt?: string): Promise<string>;
}
