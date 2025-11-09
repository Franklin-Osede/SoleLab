import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

/**
 * Swagger/OpenAPI Configuration
 * 
 * RAZÓN DE DISEÑO:
 * - Documentación automática de API
 * - Interfaz interactiva para testing
 * - Especificación OpenAPI estándar
 * - Facilita integración con frontend (Angular)
 */
export async function setupSwagger(server: FastifyInstance) {
  await server.register(swagger, {
    openapi: {
      info: {
        title: 'SoleLab API',
        description: 'API REST para plataforma de diseño de sneakers con IA y Blockchain',
        version: '1.0.0',
      },
      servers: [
        {
          url: process.env.API_URL || 'http://localhost:3001',
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'designs', description: 'Design generation endpoints' },
        { name: 'health', description: 'Health check endpoints' },
      ],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}

