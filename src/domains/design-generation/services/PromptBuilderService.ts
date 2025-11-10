import { ColorPalette } from '../value-objects/ColorPalette';
import { DesignStyleValue, DesignStyle } from '../value-objects/DesignStyle';

/**
 * Servicio de Dominio: PromptBuilderService
 * 
 * RAZÓN DE DISEÑO:
 * - Encapsula la lógica de construcción de prompts para IA
 * - Separa la lógica de negocio de la infraestructura
 * - Permite cambiar el formato de prompts sin afectar otros servicios
 * - Facilita testing (no necesita IA real)
 * 
 * PRINCIPIOS:
 * - Single Responsibility: Solo construye prompts
 * - Open/Closed: Extensible para nuevos estilos sin modificar código existente
 */
export class PromptBuilderService {
  /**
   * Construye un prompt optimizado para generación de sneakers
   * 
   * @param basePrompt - Prompt base del usuario
   * @param style - Estilo del diseño
   * @param colorPalette - Paleta de colores
   * @returns Prompt optimizado para Stable Diffusion
   */
  buildPrompt(
    basePrompt: string,
    style: DesignStyleValue,
    colorPalette: ColorPalette
  ): string {
    const stylePrompt = this.getStylePrompt(style);
    const colorPrompt = this.getColorPrompt(colorPalette);
    const qualityPrompt = 'high quality, detailed, professional, 4k, 8k';

    // Construir prompt estructurado
    const prompt = [
      basePrompt,
      stylePrompt,
      colorPrompt,
      qualityPrompt,
      'sneaker, shoe, footwear',
    ].filter(Boolean).join(', ');

    return prompt;
  }

  /**
   * Obtiene el prompt específico para el estilo
   */
  private getStylePrompt(style: DesignStyleValue): string {
    const styleMap: Record<DesignStyle, string> = {
      [DesignStyle.FUTURISTIC]: 'futuristic, cyberpunk, sci-fi, advanced technology',
      [DesignStyle.RETRO]: 'retro, vintage, 80s, 90s, classic',
      [DesignStyle.MINIMALIST]: 'minimalist, clean, simple, elegant',
      [DesignStyle.SPORTY]: 'sporty, athletic, performance, dynamic',
      [DesignStyle.LUXURY]: 'luxury, premium, high-end, sophisticated',
      [DesignStyle.STREETWEAR]: 'streetwear, urban, casual, trendy',
    };

    return styleMap[style.getValue()] || '';
  }

  /**
   * Obtiene el prompt de colores
   */
  private getColorPrompt(colorPalette: ColorPalette): string {
    const colors = colorPalette.getColors();
    const primaryColor = colorPalette.getPrimaryColor();
    const secondaryColors = colorPalette.getSecondaryColors();

    let prompt = `primary color ${primaryColor}`;

    if (secondaryColors.length > 0) {
      prompt += `, accent colors ${secondaryColors.join(', ')}`;
    }

    return prompt;
  }

  /**
   * Construye prompt negativo (lo que NO queremos en la imagen)
   */
  buildNegativePrompt(): string {
    return [
      'blurry',
      'low quality',
      'distorted',
      'deformed',
      'bad anatomy',
      'watermark',
      'text',
      'logo',
    ].join(', ');
  }
}

