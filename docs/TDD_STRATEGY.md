# Estrategia TDD (Test-Driven Development) - SoleLab

## 🎯 Filosofía TDD

### Ciclo Red-Green-Refactor

1. **🔴 RED**: Escribir test que falle
2. **🟢 GREEN**: Implementar mínimo código para pasar
3. **🔵 REFACTOR**: Mejorar código manteniendo tests verdes

### Regla de Oro

> **Nunca escribir código de producción sin un test que falle primero**

## 📊 Pirámide de Testing

```
        /\
       /E2E\         10% - Tests End-to-End
      /------\
     /Integration\   20% - Tests de Integración
    /------------\
   /   Unit Tests  \ 70% - Tests Unitarios
  /----------------\
```

### Distribución

- **70% Unit Tests**: Lógica de dominio, value objects, servicios
- **20% Integration Tests**: Repositorios, APIs externas, blockchain
- **10% E2E Tests**: Flujos completos de usuario

## 🧪 Estructura de Tests

### Unit Tests

**Ubicación**: `tests/unit/`

**Cobertura**:
- ✅ Value Objects
- ✅ Entidades de dominio
- ✅ Servicios de dominio
- ✅ Casos de uso
- ✅ Utilidades

**Ejemplo**:
```typescript
// tests/unit/domains/design-generation/value-objects/ColorPalette.test.ts
describe('ColorPalette', () => {
  it('should create valid color palette', () => {
    // RED: Test que falla
  });
  
  it('should reject invalid colors', () => {
    // Test de validación
  });
});
```

### Integration Tests

**Ubicación**: `tests/integration/`

**Cobertura**:
- ✅ Repositorios con base de datos real (test DB)
- ✅ Servicios de infraestructura (IA, Blockchain)
- ✅ APIs externas (mocks)
- ✅ Event handlers

**Ejemplo**:
```typescript
// tests/integration/repositories/DesignRepository.test.ts
describe('DesignRepository Integration', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });
  
  it('should persist and retrieve design', async () => {
    // Test con DB real
  });
});
```

### E2E Tests

**Ubicación**: `tests/e2e/`

**Cobertura**:
- ✅ Flujos completos de usuario
- ✅ API endpoints completos
- ✅ Integración frontend-backend
- ✅ Flujos blockchain end-to-end

**Ejemplo**:
```typescript
// tests/e2e/flows/design-generation-flow.test.ts
describe('Design Generation E2E Flow', () => {
  it('should generate design and mint NFT', async () => {
    // 1. Usuario crea cuenta
    // 2. Genera diseño
    // 3. Lista en marketplace
    // 4. Compra diseño
    // 5. Mint NFT
  });
});
```

## 🎨 Estrategia por Capa

### Domain Layer Tests

**Enfoque**: Tests puros, sin dependencias externas

```typescript
// tests/unit/domains/design-generation/services/DesignGenerationService.test.ts
describe('DesignGenerationService', () => {
  let service: DesignGenerationService;
  let mockAIRepository: MockAIRepository;
  
  beforeEach(() => {
    mockAIRepository = new MockAIRepository();
    service = new DesignGenerationService(mockAIRepository);
  });
  
  it('should generate design with valid prompt', async () => {
    // Arrange
    const prompt = DesignPrompt.create('futuristic sneaker');
    
    // Act
    const design = await service.generate(prompt);
    
    // Assert
    expect(design).toBeDefined();
    expect(design.isValid()).toBe(true);
  });
});
```

### Application Layer Tests

**Enfoque**: Tests de casos de uso con mocks

```typescript
// tests/unit/application/use-cases/GenerateDesignUseCase.test.ts
describe('GenerateDesignUseCase', () => {
  it('should generate design and emit event', async () => {
    // Test del caso de uso completo
  });
});
```

### Infrastructure Layer Tests

**Enfoque**: Tests de integración con servicios reales (o mocks)

```typescript
// tests/integration/infrastructure/ai/StableDiffusionService.test.ts
describe('StableDiffusionService Integration', () => {
  it('should call Stable Diffusion API', async () => {
    // Test con API real o mock
  });
});
```

## 🔗 Testing Blockchain

### Smart Contracts Tests

**Herramienta**: Hardhat + Chai

```typescript
// tests/contracts/SoleNFT.test.ts
describe('SoleNFT', () => {
  let soleNFT: SoleNFT;
  let owner: Signer;
  
  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const SoleNFTFactory = await ethers.getContractFactory('SoleNFT');
    soleNFT = await SoleNFTFactory.deploy();
  });
  
  it('should mint NFT', async () => {
    await soleNFT.mint(owner.address, 'tokenURI');
    expect(await soleNFT.balanceOf(owner.address)).to.equal(1);
  });
});
```

### Blockchain Integration Tests

```typescript
// tests/integration/blockchain/EthereumBlockchainService.test.ts
describe('EthereumBlockchainService', () => {
  it('should mint NFT on testnet', async () => {
    // Test con testnet local (Hardhat Network)
  });
});
```

## 📋 Checklist TDD

### Antes de escribir código

- [ ] ¿Qué comportamiento necesito?
- [ ] ¿Qué test escribo primero?
- [ ] ¿Qué debe fallar específicamente?

### Durante desarrollo

- [ ] Test falla por la razón correcta?
- [ ] Implementación mínima para pasar?
- [ ] Todos los tests anteriores siguen pasando?

### Después de implementar

- [ ] ¿Puedo refactorizar?
- [ ] ¿Hay duplicación?
- [ ] ¿Código es legible?

## 🎯 Cobertura Objetivo

- **Domain Layer**: 100% cobertura
- **Application Layer**: 90% cobertura
- **Infrastructure Layer**: 80% cobertura
- **Overall**: 85%+ cobertura

## 🛠️ Herramientas

### Testing Framework
- **Jest** - Unit e Integration tests
- **Supertest** - API testing
- **Hardhat** - Smart contract testing

### Mocks & Stubs
- **Jest Mocks** - Mocking de dependencias
- **Sinon** - Spies y stubs avanzados
- **Nock** - HTTP request mocking

### Coverage
- **Jest Coverage** - Cobertura de código
- **Istanbul** - Análisis de cobertura

### E2E
- **Playwright** o **Cypress** - E2E testing

## 📝 Convenciones

### Naming
- Tests: `*.test.ts` o `*.spec.ts`
- Describe: Describe el componente/clase
- It: Describe el comportamiento esperado

### Estructura AAA
```typescript
it('should do something', () => {
  // Arrange - Preparar
  const input = 'value';
  
  // Act - Ejecutar
  const result = service.doSomething(input);
  
  // Assert - Verificar
  expect(result).toBe('expected');
});
```

### Test Isolation
- Cada test es independiente
- No compartir estado entre tests
- Cleanup en `afterEach` o `afterAll`

## 🚀 Flujo de Trabajo

1. **Escribir test** → Falla (RED)
2. **Implementar mínimo** → Pasa (GREEN)
3. **Refactorizar** → Mantiene verde (REFACTOR)
4. **Commit** → "feat: add feature X with tests"
5. **Repetir** → Siguiente test


