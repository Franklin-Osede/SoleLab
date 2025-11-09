# SoleLab - Plataforma de Diseño de Sneakers con IA y Blockchain

## 🎯 Propuesta de Valor

SoleLab es una plataforma completa que combina:
- **Generación de diseños** con IA (Stable Diffusion fine-tuned)
- **Marketplace** de diseños de sneakers
- **Blockchain/NFT** para coleccionables digitales
- **Producción física** mediante partnerships
- **Comunidad** de diseñadores y coleccionistas

## 🏗️ Arquitectura DDD (Domain-Driven Design)

### Bounded Contexts

1. **Design Generation** - Generación de diseños con IA
2. **Marketplace** - Compra/venta de diseños
3. **Blockchain** - Smart contracts para NFTs y ownership
4. **User Management** - Gestión de usuarios y autenticación
5. **Production** - Integración con fabricantes

### Estructura del Proyecto

```
SoleLab/
├── src/
│   ├── domains/              # Bounded Contexts (DDD)
│   │   ├── design-generation/
│   │   ├── marketplace/
│   │   ├── blockchain/
│   │   ├── user-management/
│   │   └── production/
│   ├── shared/               # Shared Kernel
│   │   ├── value-objects/
│   │   ├── events/
│   │   └── interfaces/
│   └── infrastructure/       # Infrastructure Layer
│       ├── ai/
│       ├── blockchain/
│       ├── storage/
│       └── external-apis/
├── tests/                    # Tests TDD
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── contracts/                # Smart Contracts (Solidity)
└── docs/                     # Documentación
```

## 🧪 Estrategia TDD (Test-Driven Development)

### Flujo de trabajo TDD

1. **Red** → Escribir test que falle
2. **Green** → Implementar mínimo código para pasar
3. **Refactor** → Mejorar código manteniendo tests verdes

### Pirámide de Testing

- **Unit Tests (70%)**: Dominio, Value Objects, Servicios ✅ Implementado
- **Integration Tests (20%)**: Repositorios, APIs externas ✅ Implementado
- **E2E Tests (10%)**: Flujos completos de usuario ⏳ Pendiente

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Solo unit tests
npm run test:unit

# Solo integration tests
npm run test:integration

# Con cobertura
npm run test:coverage
```

## 🔗 Integración Blockchain

### Smart Contracts

- **SoleNFT.sol**: Contrato ERC-721 para NFTs de diseños
- **SoleMarketplace.sol**: Marketplace descentralizado
- **SoleRoyalties.sol**: Sistema de royalties para creadores

### Tecnologías

- **Solidity** para smart contracts
- **Hardhat** para desarrollo y testing
- **Ethers.js** para integración frontend/backend
- **IPFS** para almacenamiento descentralizado de metadatos

## 🚀 Roadmap

### Fase 1: MVP (Mes 1-2)
- [x] Generación básica de diseños con IA ✅
- [x] Smart contract básico (ERC-721) ✅
- [x] API REST con Fastify ✅
- [x] Base de datos con Prisma ✅
- [x] Tests unitarios e integration ✅
- [ ] Frontend simple para generar y ver diseños

### Fase 2: Marketplace (Mes 3-4)
- [ ] Sistema de compra/venta
- [ ] Integración con wallet (MetaMask)
- [ ] Perfiles de usuario

### Fase 3: Comunidad (Mes 5-6)
- [ ] Sistema de votación
- [ ] Rankings y trending
- [ ] Social features

### Fase 4: Producción (Mes 7+)
- [ ] Integración con fabricantes
- [ ] Sistema de pedidos
- [ ] Tracking de producción

## 🛠️ Stack Tecnológico

### Backend
- **Node.js + TypeScript**
- **Fastify** para API REST ✅ Implementado
- **Prisma + PostgreSQL** para base de datos ✅ Implementado
- **Stable Diffusion API** para generación de imágenes ✅ Implementado

### Frontend
- **React + TypeScript**
- **Next.js** para SSR
- **Web3.js/Ethers.js** para blockchain
- **Tailwind CSS** para UI

### Blockchain
- **Solidity**
- **Hardhat**
- **Ethereum/Polygon** (L2 para costos bajos)

### Testing
- **Jest** para unit tests
- **Supertest** para API tests
- **Hardhat** para contract tests

## 📚 Documentación

Ver `/docs` para documentación detallada:
- **[ARCHITECTURE_DECISIONS.md](./docs/ARCHITECTURE_DECISIONS.md)** - Decisiones de diseño
- **[DDD_STRATEGY.md](./docs/DDD_STRATEGY.md)** - Estrategia DDD
- **[TDD_STRATEGY.md](./docs/TDD_STRATEGY.md)** - Estrategia TDD
- **[DEVELOPMENT_GUIDE.md](./docs/DEVELOPMENT_GUIDE.md)** - Guía de desarrollo
- **[DATABASE.md](./docs/DATABASE.md)** - PostgreSQL + Prisma
- **[BLOCKCHAIN_STRATEGY.md](./docs/BLOCKCHAIN_STRATEGY.md)** - Estrategia blockchain


