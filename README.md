# SoleLab - Plataforma de Diseño de Sneakers con IA y Blockchain

## 🎯 Propuesta de Valor

SoleLab es una plataforma completa que combina:
- **Generación de diseños** con IA (Stable Diffusion)
- **Marketplace** de diseños de sneakers
- **Blockchain/NFT** para coleccionables digitales
- **Producción física** mediante partnerships
- **Comunidad** de diseñadores y coleccionistas

## 📁 Estructura del Proyecto

```
SoleLab/
├── backend/          # API REST con Fastify + TypeScript
│   ├── src/          # Código fuente del backend
│   ├── tests/        # Tests (unit, integration, e2e)
│   ├── contracts/    # Smart Contracts (Solidity)
│   └── prisma/       # Schema y migraciones de DB
│
├── frontend/         # Frontend Angular
│   └── src/          # Código fuente del frontend
│
└── docs/             # Documentación del proyecto
```

## 🚀 Inicio Rápido

### Backend

```bash
cd backend
npm install
npm run dev:api
```

API disponible en: `http://localhost:3001`
Swagger docs: `http://localhost:3001/api-docs`

### Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend disponible en: `http://localhost:4200`

## 🏗️ Arquitectura

### Backend (DDD + TDD)
- **Domain-Driven Design** con Bounded Contexts
- **Test-Driven Development** con Jest
- **Fastify** para API REST
- **Prisma + PostgreSQL** para persistencia
- **JWT** para autenticación

### Frontend (Angular)
- **Angular 17+** con standalone components
- **RxJS** para programación reactiva
- **Three.js** para visualización 3D
- **Guards e Interceptors** para autenticación

## 📚 Documentación

Ver carpeta `docs/` para documentación detallada:
- `DDD_STRATEGY.md` - Estrategia Domain-Driven Design
- `TDD_STRATEGY.md` - Estrategia Test-Driven Development
- `BLOCKCHAIN_STRATEGY.md` - Integración Blockchain
- `BACKEND_COMPLETE.md` - Estado del backend
- `DEVELOPMENT_GUIDE.md` - Guía de desarrollo

## 🛠️ Stack Tecnológico

### Backend
- Node.js + TypeScript
- Fastify
- Prisma + PostgreSQL
- Stable Diffusion API
- JWT Authentication

### Frontend
- Angular 17+
- TypeScript
- Three.js
- RxJS

### Blockchain
- Solidity
- Hardhat
- Ethers.js

## 📝 Endpoints API

### Autenticación
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login

### Diseños
- `POST /api/v1/designs` - Generar diseño (requiere auth)
- `GET /api/v1/designs` - Listar diseños (requiere auth)
- `GET /api/v1/designs/:id` - Obtener diseño (requiere auth)

## 🧪 Tests

```bash
# Backend
cd backend
npm test              # Todos los tests
npm run test:unit     # Solo unit tests
npm run test:integration  # Solo integration tests

# Frontend
cd frontend
ng test
```

## 📦 Variables de Entorno

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
STABLE_DIFFUSION_API_KEY=...
PORT=3001
FRONTEND_URL=http://localhost:4200
```

### Frontend (environment.ts)
```typescript
export const environment = {
  apiUrl: 'http://localhost:3001/api/v1'
};
```

## 🚧 Roadmap

- [x] Backend con DDD y TDD
- [x] Autenticación JWT
- [x] API REST completa
- [ ] Frontend Angular básico
- [ ] Integración Blockchain/NFTs
- [ ] Marketplace
- [ ] Producción física

## 📄 Licencia

MIT
