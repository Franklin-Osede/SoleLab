# Guía de Desarrollo - SoleLab

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Git
- MetaMask (para desarrollo frontend)

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd SoleLab

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Inicializar base de datos
npx prisma migrate dev

# Compilar contratos
npm run contracts:compile
```

## 📁 Estructura del Proyecto

```
SoleLab/
├── src/
│   ├── domains/              # Bounded Contexts (DDD)
│   │   ├── design-generation/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   └── events/
│   │   ├── marketplace/
│   │   ├── blockchain/
│   │   ├── user-management/
│   │   └── production/
│   ├── application/          # Application Layer
│   │   ├── use-cases/
│   │   └── dtos/
│   ├── infrastructure/       # Infrastructure Layer
│   │   ├── ai/
│   │   ├── blockchain/
│   │   ├── storage/
│   │   └── database/
│   ├── presentation/         # Presentation Layer
│   │   ├── api/
│   │   └── web/
│   └── shared/               # Shared Kernel
│       ├── value-objects/
│       ├── events/
│       └── interfaces/
├── contracts/                # Smart Contracts
│   ├── interfaces/
│   ├── SoleNFT.sol
│   ├── SoleMarketplace.sol
│   └── SoleRoyalties.sol
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── contracts/
└── docs/                     # Documentación
```

## 🧪 Flujo de Trabajo TDD

### 1. Escribir Test Primero

```typescript
// tests/unit/domains/design-generation/value-objects/ColorPalette.test.ts
import { ColorPalette } from '@domains/design-generation/value-objects/ColorPalette';

describe('ColorPalette', () => {
  it('should create valid color palette', () => {
    // RED: Este test fallará
    const palette = ColorPalette.create(['#FF0000', '#00FF00']);
    expect(palette).toBeDefined();
  });
});
```

### 2. Implementar Mínimo Código

```typescript
// src/domains/design-generation/value-objects/ColorPalette.ts
export class ColorPalette {
  private constructor(private colors: string[]) {}
  
  static create(colors: string[]): ColorPalette {
    return new ColorPalette(colors);
  }
}
```

### 3. Refactorizar

Mejorar código manteniendo tests verdes.

## 🏗️ Crear Nueva Feature

### Paso 1: Definir Bounded Context

Si es nuevo dominio, crear nuevo bounded context:

```bash
mkdir -p src/domains/new-context/{entities,value-objects,services,repositories,events}
```

### Paso 2: Escribir Tests

Seguir TDD: test primero, luego implementación.

### Paso 3: Implementar Domain Layer

- Entidades
- Value Objects
- Servicios de dominio
- Interfaces de repositorios

### Paso 4: Implementar Application Layer

- Casos de uso
- DTOs

### Paso 5: Implementar Infrastructure Layer

- Repositorios concretos
- Servicios externos

### Paso 6: Implementar Presentation Layer

- API endpoints
- Frontend components

## 🔗 Integración Blockchain

### Desarrollo Local

```bash
# Iniciar Hardhat Network local
npx hardhat node

# En otra terminal, deploy contratos
npm run contracts:deploy:local
```

### Testing de Contratos

```bash
npm run contracts:test
```

### Deploy a Testnet

```bash
# Configurar .env con:
# - SEPOLIA_RPC_URL
# - PRIVATE_KEY
# - ETHERSCAN_API_KEY

npm run contracts:deploy:sepolia
```

## 📝 Convenciones de Código

### Naming

- **Entidades**: PascalCase (`Design`, `User`)
- **Value Objects**: PascalCase (`ColorPalette`, `Price`)
- **Servicios**: PascalCase + Service (`DesignGenerationService`)
- **Repositorios**: PascalCase + Repository (`DesignRepository`)
- **Casos de Uso**: PascalCase + UseCase (`GenerateDesignUseCase`)
- **Tests**: `*.test.ts` o `*.spec.ts`

### Estructura de Archivos

```
domain-name/
├── entities/
│   └── EntityName.ts
├── value-objects/
│   └── ValueObjectName.ts
├── services/
│   └── ServiceName.ts
├── repositories/
│   └── IRepositoryName.ts
└── events/
    └── EventName.ts
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Solo unit tests
npm run test:unit

# Solo integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Con coverage
npm run test:coverage
```

### Escribir Tests

Seguir estructura AAA (Arrange, Act, Assert):

```typescript
it('should do something', () => {
  // Arrange
  const input = 'value';
  
  // Act
  const result = service.doSomething(input);
  
  // Assert
  expect(result).toBe('expected');
});
```

## 🔄 Git Workflow

### Branches

- `main` - Producción
- `develop` - Desarrollo
- `feature/*` - Nuevas features
- `fix/*` - Bug fixes
- `test/*` - Tests

### Commits

Formato: `tipo: descripción`

Tipos:
- `feat`: Nueva feature
- `fix`: Bug fix
- `test`: Tests
- `docs`: Documentación
- `refactor`: Refactorización
- `chore`: Tareas de mantenimiento

Ejemplo:
```
feat: add design generation service with TDD
test: add unit tests for ColorPalette value object
fix: resolve blockchain transaction timeout
```

## 📚 Recursos

- [DDD Strategy](./DDD_STRATEGY.md)
- [TDD Strategy](./TDD_STRATEGY.md)
- [Blockchain Strategy](./BLOCKCHAIN_STRATEGY.md)
- [API Documentation](./API_DOCS.md) (pendiente)

## 🐛 Troubleshooting

### Problemas Comunes

1. **Tests fallan**: Verificar que todas las dependencias estén instaladas
2. **Contratos no compilan**: Verificar versión de Solidity
3. **Blockchain connection**: Verificar variables de entorno
4. **Database errors**: Ejecutar `npx prisma migrate dev`


