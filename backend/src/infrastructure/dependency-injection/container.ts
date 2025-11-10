import { PrismaDesignRepository } from '../database/repositories/PrismaDesignRepository';
import { PrismaUserRepository } from '../database/repositories/PrismaUserRepository';
import { DesignGenerationService } from '../../domains/design-generation/services/DesignGenerationService';
import { PromptBuilderService } from '../../domains/design-generation/services/PromptBuilderService';
import { AuthService } from '../../domains/user-management/services/AuthService';
import { UserRegistrationService } from '../../domains/user-management/services/UserRegistrationService';
import { StableDiffusionService } from '../ai/StableDiffusionService';
import { JwtService } from '../auth/JwtService';
import { GenerateDesignUseCase } from '../../application/use-cases/GenerateDesignUseCase';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { DesignController } from '../../presentation/api/controllers/DesignController';
import { AuthController } from '../../presentation/api/controllers/AuthController';
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
container.register('PrismaUserRepository', () => {
  return new PrismaUserRepository(container.get('PrismaClient'));
});
container.register('StableDiffusionService', () => {
  return new StableDiffusionService(
    process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860',
    process.env.STABLE_DIFFUSION_API_KEY
  );
});
container.register('JwtService', () => {
  return new JwtService();
});

// Domain Services
container.register('PromptBuilderService', () => {
  return new PromptBuilderService();
});
container.register('AuthService', () => {
  return new AuthService();
});
container.register('DesignGenerationService', () => {
  return new DesignGenerationService(
    container.get('PrismaDesignRepository')
  );
});
container.register('UserRegistrationService', () => {
  return new UserRegistrationService(
    container.get('PrismaUserRepository'),
    container.get('AuthService')
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
container.register('RegisterUserUseCase', () => {
  return new RegisterUserUseCase(
    container.get('UserRegistrationService')
  );
});
container.register('LoginUseCase', () => {
  return new LoginUseCase(
    container.get('PrismaUserRepository'),
    container.get('AuthService'),
    container.get('JwtService')
  );
});

// Presentation Controllers
container.register('DesignController', () => {
  return new DesignController(
    container.get('GenerateDesignUseCase'),
    container.get('DesignGenerationService')
  );
});
container.register('AuthController', () => {
  return new AuthController(
    container.get('RegisterUserUseCase'),
    container.get('LoginUseCase')
  );
});

