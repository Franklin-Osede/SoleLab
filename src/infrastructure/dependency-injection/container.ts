import { PrismaDesignRepository } from '../database/repositories/PrismaDesignRepository';
import { DesignGenerationService } from '../../domains/design-generation/services/DesignGenerationService';
import { PromptBuilderService } from '../../domains/design-generation/services/PromptBuilderService';
import { StableDiffusionService } from '../ai/StableDiffusionService';
import { GenerateDesignUseCase } from '../../application/use-cases/GenerateDesignUseCase';
import { DesignController } from '../../presentation/api/controllers/DesignController';
import { prisma } from '../database/PrismaClient';

/**
 * Dependency Injection Container
 * 
 * RAZÓN DE DISEÑO:
 * - Centraliza creación de dependencias
 * - Fácil cambiar implementaciones
 * - Fácil testear (puedes inyectar mocks)
 * - Sigue Dependency Inversion Principle
 * 
 * ALTERNATIVA: Usar librerías como InversifyJS o TSyringe
 * Para este proyecto, un container simple es suficiente
 */
class Container {
  private services: Map<string, any> = new Map();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  get<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service ${key} not found`);
    }
    return factory();
  }
}

export const container = new Container();

// Registrar servicios
// Orden: Infraestructura → Dominio → Aplicación → Presentación

// Infrastructure
container.register('PrismaClient', () => prisma);
container.register('PrismaDesignRepository', () => {
  return new PrismaDesignRepository(container.get('PrismaClient'));
});
container.register('StableDiffusionService', () => {
  return new StableDiffusionService(
    process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860',
    process.env.STABLE_DIFFUSION_API_KEY
  );
});

// Domain Services
container.register('PromptBuilderService', () => {
  return new PromptBuilderService();
});
container.register('DesignGenerationService', () => {
  return new DesignGenerationService(
    container.get('PrismaDesignRepository')
  );
});

// Application Use Cases
container.register('GenerateDesignUseCase', () => {
  return new GenerateDesignUseCase(
    container.get('DesignGenerationService'),
    container.get('PromptBuilderService'),
    container.get('StableDiffusionService')
  );
});

// Presentation Controllers
container.register('DesignController', () => {
  return new DesignController(
    container.get('GenerateDesignUseCase'),
    container.get('DesignGenerationService')
  );
});

