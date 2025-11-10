import { FastifyInstance } from 'fastify';
import { createServer } from '../server';

/**
 * Helper para tests de API
 * 
 * RAZÓN DE DISEÑO:
 * - Facilita testing de API
 * - Crea servidor para tests
 * - Limpia después de tests
 */
export async function createTestServer(): Promise<FastifyInstance> {
  const server = await createServer();
  return server;
}

