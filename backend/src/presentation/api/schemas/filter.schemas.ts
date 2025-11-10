import { z } from 'zod';

/**
 * Filter Schemas
 * 
 * RAZÓN DE DISEÑO:
 * - Validación de filtros de búsqueda
 * - Type-safe filtering
 * - Reutilizable en múltiples endpoints
 */
export const DesignFilterSchema = z.object({
  style: z.enum(['futuristic', 'retro', 'minimalist', 'sporty', 'luxury', 'streetwear']).optional(),
  userId: z.string().uuid().optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
});

export type DesignFilter = z.infer<typeof DesignFilterSchema>;

