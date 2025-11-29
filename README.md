# SoleLab – AI-Powered Sneaker Design Platform with Blockchain Integration

Enterprise-grade sneaker design platform featuring AI-powered design generation, NFT minting capabilities, and a complete marketplace infrastructure built with Domain-Driven Design principles.

**TypeScript** **Fastify** **Angular** **Solidity** **PostgreSQL** **Prisma**

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Blockchain Integration](#blockchain-integration)
- [Documentation](#documentation)
- [License](#license)

## Overview

SoleLab is a production-ready platform that combines artificial intelligence, blockchain technology, and modern web development to enable users to generate unique sneaker designs, mint them as NFTs, and participate in a decentralized marketplace.

### Key Features

- **AI-Powered Design Generation**: Generate unique sneaker designs using Stable Diffusion API with customizable styles, color palettes, and prompts
- **Domain-Driven Design**: Clean architecture with bounded contexts, value objects, and domain events
- **Blockchain Integration**: ERC-721 NFT smart contracts for design ownership and provenance
- **RESTful API**: Fastify-based backend with comprehensive validation, error handling, and rate limiting
- **User Management**: Secure authentication with JWT tokens and password hashing
- **Test-Driven Development**: Comprehensive test suite with unit, integration, and contract tests
- **Type Safety**: Full TypeScript implementation across backend and frontend
- **API Documentation**: Swagger/OpenAPI documentation for all endpoints

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Angular Frontend                          │
│         (Components, Services, Guards, Interceptors)         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Fastify API Server                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │  │  Middleware  │  │    Routes    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼─────────────┘
          │                 │                 │
    ┌─────┴─────┬───────────┴───────────┬─────┴─────┐
    │           │                       │           │
┌───▼───┐ ┌────▼────┐ ┌──────────────┐ ┌─────────▼──┐
│Domain │ │Application│ │Infrastructure│ │Presentation│
│Layer  │ │  Layer   │ │    Layer     │ │   Layer    │
└───┬───┘ └────┬────┘ └──────┬───────┘ └───────────┘
    │          │              │
    │          │              │
┌───▼──────────▼──────────────▼──────────────────────────────┐
│                    Bounded Contexts                          │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Design Generation│  │ User Management   │               │
│  │                  │  │                  │               │
│  │ - Design Entity │  │ - User Entity    │               │
│  │ - ColorPalette  │  │ - Email VO       │               │
│  │ - DesignStyle   │  │ - Username VO   │               │
│  │ - ImageUrl      │  │ - PasswordHash   │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
    │
    │
┌───▼───────────────────────────────────────────────────────┐
│              Infrastructure Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │StableDiffusion│  │  Ethereum    │  │   Prisma     │      │
│  │   Service    │  │ Blockchain   │  │  Repository   │      │
│  └──────────────┘  │   Service    │  └──────────────┘      │
│                    └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
    │                    │                    │
    │                    │                    │
┌───▼──────────────┐ ┌───▼──────────────┐ ┌───▼──────────────┐
│Stable Diffusion  │ │  Ethereum        │ │  PostgreSQL      │
│      API         │ │  Network         │ │   Database       │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### Domain-Driven Design Structure

The backend follows a strict DDD architecture with clear separation of concerns:

**Domain Layer**: Pure business logic with no external dependencies
- Entities: `Design`, `User`
- Value Objects: `ColorPalette`, `DesignStyle`, `ImageUrl`, `Email`, `Username`, `PasswordHash`, `UUID`
- Domain Services: `DesignGenerationService`, `PromptBuilderService`, `AuthService`, `UserRegistrationService`
- Domain Events: `DesignGenerated`
- Repository Interfaces: `IDesignRepository`, `IUserRepository`

**Application Layer**: Use cases that orchestrate domain services
- `GenerateDesignUseCase`
- `RegisterUserUseCase`
- `LoginUseCase`

**Infrastructure Layer**: Technical implementations
- `StableDiffusionService` (AI integration)
- `EthereumBlockchainService` (Blockchain integration)
- `PrismaDesignRepository`, `PrismaUserRepository` (Database)
- `JwtService` (Authentication)

**Presentation Layer**: HTTP API with Fastify
- Controllers: `DesignController`, `AuthController`, `HealthController`
- Middleware: Authentication, validation, rate limiting, logging, error handling
- Routes: RESTful endpoints with OpenAPI schemas

## Project Structure

```
SoleLab/
├── backend/
│   ├── contracts/                    # Smart Contracts (Solidity)
│   │   ├── interfaces/
│   │   │   └── ISoleNFT.sol
│   │   └── SoleNFT.sol              # ERC-721 NFT Contract
│   │
│   ├── prisma/                       # Database Schema
│   │   └── schema.prisma            # Prisma schema (PostgreSQL)
│   │
│   ├── src/
│   │   ├── domains/                  # Domain Layer (DDD)
│   │   │   ├── design-generation/
│   │   │   │   ├── entities/
│   │   │   │   │   └── Design.ts
│   │   │   │   ├── value-objects/
│   │   │   │   │   ├── ColorPalette.ts
│   │   │   │   │   ├── DesignStyle.ts
│   │   │   │   │   └── ImageUrl.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── DesignGenerationService.ts
│   │   │   │   │   └── PromptBuilderService.ts
│   │   │   │   ├── repositories/
│   │   │   │   │   └── IDesignRepository.ts
│   │   │   │   └── events/
│   │   │   │       └── DesignGenerated.ts
│   │   │   │
│   │   │   └── user-management/
│   │   │       ├── entities/
│   │   │       │   └── User.ts
│   │   │       ├── value-objects/
│   │   │       │   ├── Email.ts
│   │   │       │   ├── Username.ts
│   │   │       │   └── PasswordHash.ts
│   │   │       ├── services/
│   │   │       │   ├── AuthService.ts
│   │   │       │   └── UserRegistrationService.ts
│   │   │       └── repositories/
│   │   │           └── IUserRepository.ts
│   │   │
│   │   ├── application/              # Application Layer
│   │   │   └── use-cases/
│   │   │       ├── GenerateDesignUseCase.ts
│   │   │       ├── RegisterUserUseCase.ts
│   │   │       └── LoginUseCase.ts
│   │   │
│   │   ├── infrastructure/           # Infrastructure Layer
│   │   │   ├── ai/
│   │   │   │   ├── IAIService.ts
│   │   │   │   └── StableDiffusionService.ts
│   │   │   ├── blockchain/
│   │   │   │   └── EthereumBlockchainService.ts
│   │   │   ├── database/
│   │   │   │   ├── PrismaClient.ts
│   │   │   │   └── repositories/
│   │   │   │       ├── PrismaDesignRepository.ts
│   │   │   │       └── PrismaUserRepository.ts
│   │   │   ├── auth/
│   │   │   │   └── JwtService.ts
│   │   │   └── dependency-injection/
│   │   │       └── container.ts
│   │   │
│   │   ├── presentation/             # Presentation Layer
│   │   │   └── api/
│   │   │       ├── controllers/
│   │   │       │   ├── DesignController.ts
│   │   │       │   ├── AuthController.ts
│   │   │       │   └── HealthController.ts
│   │   │       ├── middleware/
│   │   │       │   ├── auth.middleware.ts
│   │   │       │   ├── error-handler.middleware.ts
│   │   │       │   ├── logging.middleware.ts
│   │   │       │   ├── rate-limit.middleware.ts
│   │   │       │   ├── validation.middleware.ts
│   │   │       │   └── ...
│   │   │       ├── routes/
│   │   │       │   ├── design.routes.ts
│   │   │       │   └── auth.routes.ts
│   │   │       ├── schemas/
│   │   │       │   ├── design.schemas.ts
│   │   │       │   └── pagination.schemas.ts
│   │   │       ├── swagger/
│   │   │       │   └── swagger.config.ts
│   │   │       └── server.ts
│   │   │
│   │   ├── shared/                   # Shared Kernel
│   │   │   ├── value-objects/
│   │   │   │   └── UUID.ts
│   │   │   └── events/
│   │   │       └── DomainEvent.ts
│   │   │
│   │   └── index.ts                  # Application Entry Point
│   │
│   ├── tests/                        # Test Suite
│   │   ├── unit/                     # Unit Tests
│   │   │   ├── domains/
│   │   │   │   └── design-generation/
│   │   │   └── shared/
│   │   ├── integration/              # Integration Tests
│   │   │   ├── api/
│   │   │   ├── repositories/
│   │   │   └── use-cases/
│   │   └── contracts/                # Smart Contract Tests
│   │       └── SoleNFT.test.ts
│   │
│   ├── hardhat.config.ts            # Hardhat Configuration
│   ├── jest.config.js               # Jest Configuration
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                 # Core Services
│   │   │   │   ├── guards/
│   │   │   │   │   └── auth.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── auth.interceptor.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── design.model.ts
│   │   │   │   │   └── user.model.ts
│   │   │   │   └── services/
│   │   │   │       ├── api.service.ts
│   │   │   │       ├── auth.service.ts
│   │   │   │       └── design.service.ts
│   │   │   │
│   │   │   ├── features/             # Feature Modules
│   │   │   │   ├── auth/
│   │   │   │   └── design/
│   │   │   │
│   │   │   ├── shared/               # Shared Components
│   │   │   │   ├── components/
│   │   │   │   ├── directives/
│   │   │   │   └── pipes/
│   │   │   │
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   │
│   │   └── environments/
│   │       ├── environment.ts
│   │       └── environment.prod.ts
│   │
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
└── docs/                             # Documentation
    ├── ARCHITECTURE_DECISIONS.md
    ├── DDD_STRATEGY.md
    ├── TDD_STRATEGY.md
    ├── BLOCKCHAIN_STRATEGY.md
    ├── BACKEND_COMPLETE.md
    ├── DEVELOPMENT_GUIDE.md
    └── ...
```

## Technology Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Fastify 4.x (high-performance HTTP server)
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Validation**: Zod schema validation
- **AI Integration**: Stable Diffusion API
- **Blockchain**: Ethers.js v6 for Ethereum interaction
- **Testing**: Jest with Supertest for API testing
- **Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: Angular 20+ (standalone components)
- **Language**: TypeScript 5.x
- **State Management**: RxJS
- **3D Visualization**: Three.js
- **HTTP Client**: Angular HttpClient with interceptors

### Blockchain

- **Smart Contracts**: Solidity 0.8.20
- **Development Framework**: Hardhat
- **Contract Standard**: ERC-721 (NFT standard)
- **Libraries**: OpenZeppelin Contracts
- **Networks**: Ethereum Sepolia (testnet), Mumbai (testnet), Hardhat (local)

### Infrastructure

- **Database**: PostgreSQL
- **ORM**: Prisma
- **Containerization**: Docker (ready for deployment)
- **Version Control**: Git

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or Docker for PostgreSQL)
- Git
- MetaMask (for blockchain interactions in frontend)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SoleLab

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

#### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=3001
HOST=0.0.0.0
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/solelab

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# AI Service
STABLE_DIFFUSION_API_URL=https://api.stable-diffusion.com
STABLE_DIFFUSION_API_KEY=your-api-key

# Blockchain (optional for development)
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your-project-id
SOLE_NFT_CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your-private-key-for-transactions
```

#### Frontend Configuration

Update `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001/api/v1'
};
```

### Database Setup

```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### Compile Smart Contracts

```bash
cd backend

# Compile contracts
npm run contracts:compile

# Run contract tests
npm run contracts:test
```

## Development

### Backend Development

```bash
cd backend

# Start development server with hot reload
npm run dev:api

# Server will be available at http://localhost:3001
# API documentation at http://localhost:3001/api-docs
```

### Frontend Development

```bash
cd frontend

# Start Angular development server
npm start

# Application will be available at http://localhost:4200
```

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage
npm run test:coverage

# Run contract tests
npm run contracts:test
```

## Testing

The project follows Test-Driven Development (TDD) principles with comprehensive test coverage:

- **Unit Tests**: Test individual domain entities, value objects, and services in isolation
- **Integration Tests**: Test API endpoints, repositories, and use cases with real database
- **Contract Tests**: Test smart contracts with Hardhat

Test structure mirrors the source code structure for easy navigation.

## API Documentation

### Base URL

```
http://localhost:3001/api/v1
```

### Authentication Endpoints

#### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "securepassword",
  "walletAddress": "0x..." // Optional
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response includes JWT token for authenticated requests.

### Design Endpoints

All design endpoints require authentication via Bearer token in the `Authorization` header.

#### Generate Design

```http
POST /api/v1/designs
Authorization: Bearer <token>
Content-Type: application/json

{
  "basePrompt": "futuristic sneaker with neon accents",
  "style": "futuristic",
  "colors": ["#FF0000", "#00FF00", "#0000FF"]
}
```

**Available Styles**: `futuristic`, `retro`, `minimalist`, `sporty`, `luxury`, `streetwear`

#### Get Design by ID

```http
GET /api/v1/designs/:id
Authorization: Bearer <token>
```

#### Get User Designs

```http
GET /api/v1/designs/user/:userId
Authorization: Bearer <token>
```

#### List All Designs

```http
GET /api/v1/designs?page=1&pageSize=10&style=futuristic&userId=...
Authorization: Bearer <token>
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 10, max: 100)
- `style`: Filter by style
- `userId`: Filter by user ID
- `createdAfter`: Filter by creation date (ISO 8601)
- `createdBefore`: Filter by creation date (ISO 8601)

### Health Check

```http
GET /health
GET /health/ready
```

### Interactive API Documentation

During development, Swagger UI is available at:

```
http://localhost:3001/api-docs
```

## Blockchain Integration

### Smart Contracts

The project includes an ERC-721 NFT contract (`SoleNFT.sol`) for minting design NFTs:

- **Standard**: ERC-721 with URI storage extension
- **Features**: Minting with fees, creator tracking, ownership verification
- **Security**: ReentrancyGuard, Ownable pattern from OpenZeppelin

### Contract Deployment

```bash
cd backend

# Deploy to local Hardhat network
npm run contracts:deploy:local

# Deploy to Sepolia testnet
npm run contracts:deploy:sepolia
```

### Blockchain Service

The `EthereumBlockchainService` provides methods for:
- Minting NFTs with metadata URI
- Querying token ownership
- Getting creator information
- Checking minting fees

### Integration Flow

1. User generates a design via API
2. Design metadata is stored in IPFS (to be implemented)
3. Backend mints NFT using `EthereumBlockchainService`
4. NFT token ID and transaction hash are stored with the design
5. User owns the NFT in their wallet

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **ARCHITECTURE_DECISIONS.md**: Detailed explanation of architectural choices
- **DDD_STRATEGY.md**: Domain-Driven Design strategy and bounded contexts
- **TDD_STRATEGY.md**: Test-Driven Development approach
- **BLOCKCHAIN_STRATEGY.md**: Blockchain integration strategy
- **BACKEND_COMPLETE.md**: Backend implementation status
- **DEVELOPMENT_GUIDE.md**: Development workflow and conventions
- **FOLDER_STRUCTURE.md**: Project structure explanation
- **DATABASE.md**: Database schema and migrations
- **TROUBLESHOOTING.md**: Common issues and solutions

## Security Features

- **Rate Limiting**: 10 requests per minute per IP
- **Input Validation**: Zod schema validation on all endpoints
- **Password Hashing**: bcrypt with secure salt rounds
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for specific frontend origin
- **Error Handling**: Secure error messages without exposing internals
- **Request Timeout**: Prevents long-running requests
- **Request ID Tracking**: For debugging and audit trails

## Roadmap

### Completed

- Domain-Driven Design architecture implementation
- RESTful API with Fastify
- User authentication and registration
- AI-powered design generation
- Database integration with Prisma
- Comprehensive test suite
- Smart contract development (ERC-721)
- API documentation with Swagger

### In Progress

- Frontend Angular application
- NFT minting integration
- IPFS metadata storage

### Planned

- Marketplace functionality
- Advanced design filters and search
- Real-time notifications
- Production deployment configuration
- CI/CD pipeline
- Performance optimization
- Advanced analytics

## License

MIT License

---

For detailed technical documentation, see the `docs/` directory.
