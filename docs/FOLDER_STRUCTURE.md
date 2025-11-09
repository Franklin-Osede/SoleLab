# Estructura de Carpetas - SoleLab

## 📁 Estructura Completa

```
SoleLab/
├── contracts/                    # Smart Contracts (Solidity)
│   ├── interfaces/
│   │   └── ISoleNFT.sol         # Interface del contrato NFT
│   └── SoleNFT.sol              # Contrato ERC-721 principal
│
├── docs/                         # Documentación
│   ├── ARCHITECTURE_DECISIONS.md # Decisiones de diseño
│   ├── BLOCKCHAIN_STRATEGY.md    # Estrategia blockchain
│   ├── DDD_STRATEGY.md           # Estrategia DDD
│   ├── DEVELOPMENT_GUIDE.md      # Guía de desarrollo
│   ├── EXECUTIVE_SUMMARY.md      # Resumen ejecutivo
│   ├── FOLDER_STRUCTURE.md       # Este archivo
│   ├── PROPOSAL_VALUE.md         # Propuesta de valor
│   └── TDD_STRATEGY.md           # Estrategia TDD
│
├── src/                          # Código fuente
│   ├── application/              # Application Layer
│   │   └── use-cases/
│   │       └── GenerateDesignUseCase.ts
│   │
│   ├── domains/                  # Domain Layer (Bounded Contexts)
│   │   └── design-generation/
│   │       ├── entities/
│   │       │   └── Design.ts     # Entidad principal
│   │       ├── events/
│   │       │   └── DesignGenerated.ts
│   │       ├── repositories/
│   │       │   └── IDesignRepository.ts
│   │       ├── services/
│   │       │   ├── DesignGenerationService.ts
│   │       │   └── PromptBuilderService.ts
│   │       └── value-objects/
│   │           ├── ColorPalette.ts
│   │           └── DesignStyle.ts
│   │
│   ├── infrastructure/           # Infrastructure Layer
│   │   ├── ai/
│   │   │   ├── IAIService.ts
│   │   │   └── StableDiffusionService.ts
│   │   ├── blockchain/
│   │   │   └── EthereumBlockchainService.ts
│   │   └── database/
│   │       └── repositories/
│   │           └── PrismaDesignRepository.ts
│   │
│   ├── presentation/             # Presentation Layer (pendiente)
│   │   ├── api/                  # API REST
│   │   └── web/                  # Frontend (Next.js)
│   │
│   └── shared/                   # Shared Kernel
│       ├── events/
│       │   └── DomainEvent.ts
│       └── value-objects/
│           └── UUID.ts
│
└── tests/                        # Tests (TDD)
    ├── contracts/
    │   └── SoleNFT.test.ts       # Tests de smart contracts
    ├── unit/                     # Tests unitarios (70%)
    │   └── domains/
    │       └── design-generation/
    │           ├── entities/
    │           │   └── Design.test.ts
    │           ├── services/
    │           │   ├── DesignGenerationService.test.ts
    │           │   └── PromptBuilderService.test.ts
    │           └── value-objects/
    │               └── ColorPalette.test.ts
    ├── integration/              # Tests de integración (20%)
    └── e2e/                      # Tests end-to-end (10%)
```

## 🎯 Explicación por Capa

### 1. Domain Layer (`src/domains/`)

**Propósito**: Lógica de negocio pura, sin dependencias externas.

**Estructura por Bounded Context**:
```
design-generation/
├── entities/          # Entidades con identidad (Design)
├── value-objects/     # Objetos de valor inmutables (ColorPalette)
├── services/         # Servicios de dominio (lógica de negocio)
├── repositories/      # Interfaces de repositorios (no implementaciones)
└── events/           # Eventos de dominio (DesignGenerated)
```

**Razón de esta estructura**:
- ✅ **Separación clara**: Cada tipo de componente en su carpeta
- ✅ **Fácil navegación**: Encuentras rápidamente lo que buscas
- ✅ **Escalable**: Fácil agregar nuevos bounded contexts
- ✅ **DDD puro**: Solo lógica de negocio, sin infraestructura

### 2. Application Layer (`src/application/`)

**Propósito**: Orquesta casos de uso, conecta Domain con Infrastructure.

**Estructura**:
```
application/
└── use-cases/
    └── GenerateDesignUseCase.ts
```

**Razón**:
- ✅ **Casos de uso claros**: Un archivo = un caso de uso
- ✅ **Orquestación**: Coordina servicios de dominio e infraestructura
- ✅ **DTOs**: Convierte entre entidades de dominio y DTOs

### 3. Infrastructure Layer (`src/infrastructure/`)

**Propósito**: Implementa detalles técnicos (base de datos, APIs, blockchain).

**Estructura**:
```
infrastructure/
├── ai/                    # Servicios de IA
├── blockchain/           # Servicios blockchain
├── database/             # Repositorios concretos
└── storage/              # Almacenamiento (IPFS, S3)
```

**Razón**:
- ✅ **Agrupación por tecnología**: Fácil encontrar implementaciones
- ✅ **Separación de concerns**: Cada tecnología en su lugar
- ✅ **Intercambiable**: Fácil cambiar implementaciones

### 4. Presentation Layer (`src/presentation/`)

**Propósito**: API REST y Frontend (pendiente de implementar).

**Estructura planificada**:
```
presentation/
├── api/                  # API REST (Express/Fastify)
│   ├── controllers/
│   ├── routes/
│   └── middleware/
└── web/                  # Frontend (Next.js)
    ├── components/
    ├── pages/
    └── hooks/
```

### 5. Shared Kernel (`src/shared/`)

**Propósito**: Elementos compartidos entre bounded contexts.

**Estructura**:
```
shared/
├── value-objects/    # UUID, Money, etc.
├── events/          # DomainEvent base
└── interfaces/       # Interfaces comunes
```

**Razón**:
- ✅ **Mínimo compartido**: Solo lo realmente necesario
- ✅ **Evita acoplamiento**: No compartir demasiado
- ✅ **Reutilizable**: Elementos básicos compartidos

## 🧪 Estructura de Tests

**Pirámide de Testing**:
```
tests/
├── unit/              # 70% - Tests unitarios
│   └── domains/       # Tests de dominio
├── integration/       # 20% - Tests de integración
│   └── repositories/  # Tests con DB real
└── e2e/              # 10% - Tests end-to-end
    └── flows/        # Flujos completos
```

**Razón**:
- ✅ **Pirámide de testing**: Más tests unitarios, menos E2E
- ✅ **Tests rápidos**: Unit tests son rápidos
- ✅ **Tests confiables**: Integration tests verifican integración real

## 📦 Smart Contracts

**Estructura**:
```
contracts/
├── interfaces/        # Interfaces de contratos
└── SoleNFT.sol      # Contrato principal
```

**Razón**:
- ✅ **Separación clara**: Contratos separados del código TypeScript
- ✅ **Fácil compilar**: Hardhat compila desde esta carpeta
- ✅ **Versionado**: Contratos versionados independientemente

## 🔄 Flujo de Dependencias

```
Presentation Layer
    ↓ (depende de)
Application Layer
    ↓ (depende de)
Domain Layer ← Infrastructure Layer (implementa interfaces del dominio)
```

**Regla de Dependencias**:
- ✅ Domain no depende de nada
- ✅ Application depende de Domain
- ✅ Infrastructure implementa interfaces de Domain
- ✅ Presentation depende de Application

## 📊 Métricas de Estructura

### Complejidad por Capa

- **Domain**: Alta complejidad de negocio, baja complejidad técnica
- **Application**: Media complejidad (orquestación)
- **Infrastructure**: Baja complejidad de negocio, alta complejidad técnica
- **Presentation**: Baja complejidad de negocio, media complejidad técnica

### Tamaño Esperado

- **Domain**: ~40% del código (lógica de negocio)
- **Application**: ~20% del código (casos de uso)
- **Infrastructure**: ~30% del código (implementaciones)
- **Presentation**: ~10% del código (API/Frontend)

## ✅ Checklist de Estructura

- [x] Domain Layer sin dependencias externas
- [x] Application Layer orquesta casos de uso
- [x] Infrastructure implementa interfaces del dominio
- [x] Tests organizados por tipo (unit, integration, e2e)
- [x] Smart contracts separados
- [x] Documentación completa
- [x] Shared Kernel mínimo
- [x] Bounded contexts claramente separados

## 🚀 Próximos Pasos

1. **Completar Presentation Layer**
   - [ ] API REST con Express/Fastify
   - [ ] Frontend con Next.js
   - [ ] Controllers y routes

2. **Agregar más Bounded Contexts**
   - [ ] Marketplace context
   - [ ] User Management context
   - [ ] Blockchain context

3. **Completar Tests**
   - [ ] Integration tests
   - [ ] E2E tests
   - [ ] Contract tests

