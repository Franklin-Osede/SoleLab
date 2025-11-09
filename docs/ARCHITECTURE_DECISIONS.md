# Decisiones de Arquitectura - SoleLab

Este documento explica las decisiones de diseño y arquitectura tomadas en SoleLab, siguiendo las mejores prácticas de DDD, TDD y desarrollo de software.

## 📐 Estructura de Carpetas

### Razón: Separación por Capas (Layered Architecture)

```
src/
├── domains/          # Domain Layer (Lógica de negocio pura)
├── application/      # Application Layer (Casos de uso)
├── infrastructure/   # Infrastructure Layer (Detalles técnicos)
├── presentation/    # Presentation Layer (API, Frontend)
└── shared/          # Shared Kernel (Elementos compartidos)
```

**Por qué esta estructura:**
- ✅ **Separación de Responsabilidades**: Cada capa tiene un propósito claro
- ✅ **Dependency Rule**: Las dependencias van hacia adentro (Domain no depende de nada)
- ✅ **Testabilidad**: Fácil de testear cada capa independientemente
- ✅ **Mantenibilidad**: Cambios en una capa no afectan otras
- ✅ **Escalabilidad**: Fácil agregar nuevos bounded contexts

### Domain Layer (`src/domains/`)

**Razón**: Contiene la lógica de negocio pura, sin dependencias externas.

```
domains/
└── design-generation/
    ├── entities/        # Entidades de dominio (Design)
    ├── value-objects/   # Objetos de valor (ColorPalette, DesignStyle)
    ├── services/        # Servicios de dominio (DesignGenerationService)
    ├── repositories/    # Interfaces de repositorios (IDesignRepository)
    └── events/          # Eventos de dominio (DesignGenerated)
```

**Decisiones clave:**
1. **Entidades con constructor privado**: Solo se crean mediante factory methods (`create()`, `reconstitute()`)
   - ✅ Garantiza invariantes del dominio
   - ✅ Controla cómo se crean las entidades
   - ✅ Facilita testing

2. **Value Objects inmutables**: Una vez creados, no cambian
   - ✅ Thread-safe
   - ✅ Sin efectos secundarios
   - ✅ Fácil de testear

3. **Interfaces de repositorios en dominio**: El dominio define qué necesita, no cómo
   - ✅ Dependency Inversion Principle
   - ✅ Fácil cambiar implementación (Prisma → MongoDB)
   - ✅ Domain no depende de infraestructura

### Application Layer (`src/application/`)

**Razón**: Orquesta casos de uso, conecta Domain con Infrastructure.

```
application/
└── use-cases/
    └── GenerateDesignUseCase.ts
```

**Decisiones clave:**
1. **Casos de uso como clases**: Cada caso de uso es una clase
   - ✅ Single Responsibility
   - ✅ Fácil de testear
   - ✅ Reutilizable

2. **DTOs en lugar de entidades**: La aplicación retorna DTOs, no entidades
   - ✅ Desacopla dominio de presentación
   - ✅ Controla qué se expone
   - ✅ Facilita versionado de API

3. **Orquestación, no lógica**: Los casos de uso orquestan, no contienen lógica de negocio
   - ✅ Lógica de negocio en Domain Layer
   - ✅ Casos de uso delgados y claros

### Infrastructure Layer (`src/infrastructure/`)

**Razón**: Implementa detalles técnicos (base de datos, APIs externas, blockchain).

```
infrastructure/
├── ai/                    # Servicios de IA
├── blockchain/           # Servicios blockchain
├── database/             # Repositorios concretos
└── storage/              # Almacenamiento (IPFS, S3)
```

**Decisiones clave:**
1. **Implementaciones concretas**: Aquí van las implementaciones reales
   - ✅ Prisma para base de datos
   - ✅ Ethers.js para blockchain
   - ✅ Fetch/axios para APIs

2. **Interfaces en dominio**: Las interfaces están en Domain/Application
   - ✅ Dependency Inversion
   - ✅ Infrastructure implementa, no define

3. **Conversión de modelos**: Convierte entre modelos de dominio y modelos técnicos
   - ✅ Domain no conoce Prisma
   - ✅ Separación clara de responsabilidades

### Shared Kernel (`src/shared/`)

**Razón**: Elementos compartidos entre bounded contexts.

```
shared/
├── value-objects/    # UUID, Money, etc.
├── events/           # DomainEvent base
└── interfaces/       # Interfaces comunes
```

**Decisiones clave:**
1. **Mínimo compartido**: Solo lo realmente compartido
   - ✅ Evita acoplamiento entre contextos
   - ✅ Facilita evolución independiente

2. **Value Objects básicos**: UUID, Timestamp, etc.
   - ✅ Reutilizables
   - ✅ Sin lógica de negocio específica

## 🏗️ Patrones de Diseño

### 1. Repository Pattern

**Razón**: Abstrae acceso a datos.

```typescript
// Domain define interface
interface IDesignRepository {
  save(design: Design): Promise<void>;
  findById(id: UUID): Promise<Design | null>;
}

// Infrastructure implementa
class PrismaDesignRepository implements IDesignRepository {
  // Implementación con Prisma
}
```

**Beneficios:**
- ✅ Domain no conoce detalles de persistencia
- ✅ Fácil cambiar de base de datos
- ✅ Fácil testear con mocks

### 2. Factory Pattern

**Razón**: Controla creación de entidades.

```typescript
class Design {
  private constructor(...) {}
  
  static create(...): { design: Design; event: DesignGenerated } {
    // Validaciones
    // Crear entidad
    // Emitir evento
  }
  
  static reconstitute(...): Design {
    // Reconstruir desde persistencia
  }
}
```

**Beneficios:**
- ✅ Garantiza invariantes
- ✅ Encapsula lógica de creación
- ✅ Facilita testing

### 3. Domain Events

**Razón**: Comunicación asíncrona entre bounded contexts.

```typescript
class DesignGenerated extends DomainEvent {
  constructor(aggregateId: UUID, userId: UUID, imageUrl: string) {
    super(aggregateId);
  }
}
```

**Beneficios:**
- ✅ Desacoplamiento entre contextos
- ✅ Escalabilidad
- ✅ Trazabilidad

### 4. Dependency Injection

**Razón**: Inversión de dependencias.

```typescript
class DesignGenerationService {
  constructor(private repository: IDesignRepository) {}
}
```

**Beneficios:**
- ✅ Fácil testear con mocks
- ✅ Fácil cambiar implementaciones
- ✅ Bajo acoplamiento

## 🧪 Estrategia de Testing

### Estructura de Tests

```
tests/
├── unit/              # Tests unitarios (70%)
├── integration/       # Tests de integración (20%)
├── e2e/              # Tests end-to-end (10%)
└── contracts/        # Tests de smart contracts
```

**Razón**: Pirámide de testing.

**Decisiones:**
1. **Tests unitarios primero**: Escribir tests antes del código (TDD)
   - ✅ Garantiza que el código funciona
   - ✅ Documenta comportamiento
   - ✅ Facilita refactoring

2. **Mocks para dependencias**: Mockear repositorios, servicios externos
   - ✅ Tests rápidos
   - ✅ Tests aislados
   - ✅ Sin dependencias externas

3. **Tests de integración**: Con base de datos real (test DB)
   - ✅ Verifica integración real
   - ✅ Detecta problemas de mapeo

## 🔗 Integración Blockchain

### Estructura

```
contracts/
├── interfaces/        # Interfaces de contratos
└── SoleNFT.sol       # Contrato principal

src/infrastructure/blockchain/
└── EthereumBlockchainService.ts
```

**Decisiones:**
1. **Contratos separados**: Smart contracts en carpeta `contracts/`
   - ✅ Separación clara
   - ✅ Fácil compilar y deployar

2. **Servicio de infraestructura**: Encapsula interacción con blockchain
   - ✅ Domain no conoce detalles de blockchain
   - ✅ Fácil cambiar de red (Ethereum → Polygon)

3. **Eventos de dominio**: Los eventos de blockchain se convierten a eventos de dominio
   - ✅ Consistencia con DDD
   - ✅ Desacoplamiento

## 📦 Value Objects

### Por qué Value Objects

```typescript
class ColorPalette {
  private constructor(private colors: string[]) {
    this.validate(colors);
  }
}
```

**Razón:**
- ✅ **Inmutabilidad**: Una vez creado, no cambia
- ✅ **Validación**: Garantiza que siempre es válido
- ✅ **Comparación por valor**: `equals()` compara valores, no referencias
- ✅ **Sin identidad**: No tienen ID, se comparan por valor

**Ejemplos:**
- `ColorPalette` - Paleta de colores validada
- `UUID` - Identificador único validado
- `DesignStyle` - Estilo validado

## 🎯 Principios Aplicados

### SOLID Principles

1. **Single Responsibility**: Cada clase tiene una responsabilidad
   - `DesignGenerationService` - Solo genera diseños
   - `PromptBuilderService` - Solo construye prompts

2. **Open/Closed**: Abierto para extensión, cerrado para modificación
   - Nuevos estilos sin modificar código existente
   - Nuevos repositorios implementando interfaces

3. **Liskov Substitution**: Las implementaciones son intercambiables
   - Cualquier implementación de `IDesignRepository` funciona
   - Cualquier implementación de `IAIService` funciona

4. **Interface Segregation**: Interfaces específicas, no genéricas
   - `IDesignRepository` solo métodos necesarios
   - No interfaces "god object"

5. **Dependency Inversion**: Depender de abstracciones, no concreciones
   - Domain depende de interfaces, no implementaciones
   - Infrastructure implementa interfaces

### DDD Principles

1. **Ubiquitous Language**: Términos del dominio consistentes
   - `Design`, `ColorPalette`, `DesignStyle` - Términos del dominio

2. **Bounded Contexts**: Contextos claramente delimitados
   - `design-generation`, `marketplace`, `blockchain` - Contextos separados

3. **Aggregates**: Agregados con raíces bien definidas
   - `Design` es aggregate root
   - Solo se accede a través de la raíz

4. **Domain Events**: Comunicación asíncrona
   - `DesignGenerated` - Evento cuando se genera diseño

## 🚀 Escalabilidad

### Cómo Escalar

1. **Nuevos Bounded Contexts**: Agregar nueva carpeta en `domains/`
   - ✅ No afecta contextos existentes
   - ✅ Evolución independiente

2. **Nuevas Implementaciones**: Agregar en `infrastructure/`
   - ✅ Fácil cambiar de Prisma a MongoDB
   - ✅ Fácil agregar nuevos servicios

3. **Nuevos Casos de Uso**: Agregar en `application/use-cases/`
   - ✅ Sin modificar código existente
   - ✅ Extensión clara

## 📚 Referencias

- **Domain-Driven Design** - Eric Evans
- **Clean Architecture** - Robert C. Martin
- **Test-Driven Development** - Kent Beck
- **SOLID Principles** - Robert C. Martin

