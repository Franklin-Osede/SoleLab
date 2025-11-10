import { z } from 'zod';

/**
 * Schemas de Validación con Zod
 * 
 * RAZÓN DE DISEÑO:
 * - Validación de inputs HTTP antes de llegar al dominio
 * - Type-safe validation
 * - Mensajes de error claros
 * - Separación de concerns: validación HTTP vs validación de dominio
 */
export const GenerateDesignSchema = z.object({
  // userId se obtiene del token JWT, no del body
  basePrompt: z.string().min(1, 'Prompt cannot be empty').max(500, 'Prompt too long'),
  style: z.enum(['futuristic', 'retro', 'minimalist', 'sporty', 'luxury', 'streetwear'], {
    errorMap: () => ({ message: 'Invalid style. Must be one of: futuristic, retro, minimalist, sporty, luxury, streetwear' }),
  }),
  colors: z.array(z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format')).min(1, 'At least one color required').max(10, 'Maximum 10 colors allowed'),
});

export const GetDesignByIdSchema = z.object({
  id: z.string().uuid('Invalid design ID format'),
});

export const GetUserDesignsSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export type GenerateDesignRequest = z.infer<typeof GenerateDesignSchema>;
export type GetDesignByIdRequest = z.infer<typeof GetDesignByIdSchema>;
export type GetUserDesignsRequest = z.infer<typeof GetUserDesignsSchema>;

