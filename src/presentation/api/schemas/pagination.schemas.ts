import { z } from 'zod';

/**
 * Pagination Schemas
 * 
 * RAZÓN DE DISEÑO:
 * - Validación de parámetros de paginación
 * - Valores por defecto
 * - Límites de seguridad
 */
export const PaginationQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)).pipe(z.number().int().min(1)),
  pageSize: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)).pipe(z.number().int().min(1).max(100)),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

