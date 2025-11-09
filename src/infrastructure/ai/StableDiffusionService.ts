import { IAIService } from './IAIService';

/**
 * Implementación: StableDiffusionService
 * 
 * RAZÓN DE DISEÑO:
 * - Implementación concreta de IAIService
 * - Encapsula detalles de integración con Stable Diffusion
 * - Puede ser reemplazada por otra implementación sin afectar dominio
 * - Maneja errores de infraestructura
 * 
 * PRINCIPIOS:
 * - Dependency Inversion: Implementa interface, no al revés
 * - Single Responsibility: Solo se encarga de comunicación con IA
 * - Error Handling: Convierte errores técnicos a errores de dominio
 */
export class StableDiffusionService implements IAIService {
  constructor(
    private apiUrl: string,
    private apiKey?: string
  ) {
    if (!apiUrl) {
      throw new Error('Stable Diffusion API URL is required');
    }
  }

  async generateImage(prompt: string, negativePrompt: string): Promise<string> {
    try {
      // Construir request body según API de Stable Diffusion
      const requestBody = {
        prompt,
        negative_prompt: negativePrompt,
        steps: 50,
        width: 512,
        height: 512,
        guidance_scale: 7.5,
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      // Llamar a API
      const response = await fetch(`${this.apiUrl}/api/v1/txt2img`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Stable Diffusion API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Retornar URL de imagen generada
      // Nota: La estructura puede variar según la API usada
      return data.images?.[0] || data.image_url || '';
    } catch (error) {
      // Convertir error técnico a error de dominio
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateVariations(prompt: string, count: number): Promise<string[]> {
    const variations: string[] = [];

    // Generar variaciones en paralelo para mejor performance
    const promises = Array.from({ length: count }, () =>
      this.generateImage(prompt, '')
    );

    const results = await Promise.allSettled(promises);

    // Filtrar solo las exitosas
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        variations.push(result.value);
      }
    });

    return variations;
  }
}

