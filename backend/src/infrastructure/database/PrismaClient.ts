import { PrismaClient as PrismaClientType } from '@prisma/client';

/**
 * Singleton de Prisma Client
 * 
 * RAZÓN DE DISEÑO:
 * - Prisma Client debe ser singleton para evitar múltiples conexiones
 * - En desarrollo, se recarga con hot-reload
 * - En producción, reutiliza la misma instancia
 * 
 * PATRÓN: Singleton Pattern
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientType | undefined;
}

export const prisma: PrismaClientType =
  global.prisma ||
  new PrismaClientType({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

