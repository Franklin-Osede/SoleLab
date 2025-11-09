# Estrategia DDD (Domain-Driven Design) - SoleLab

## 📐 Arquitectura por Capas

### 1. Domain Layer (Capa de Dominio)

Contiene la lógica de negocio pura, sin dependencias externas.

#### Bounded Contexts

##### 1.1 Design Generation Context

**Responsabilidad**: Generar y gestionar diseños de sneakers usando IA

**Entidades**:
- `Design` - Diseño de sneaker generado
- `DesignPrompt` - Prompt usado para generar el diseño
- `DesignSpecification` - Especificaciones del diseño (colores, materiales, etc.)

**Value Objects**:
- `ColorPalette` - Paleta de colores
- `MaterialType` - Tipo de material (cuero, tela, sintético)
- `ShoeSize` - Tamaño de zapatilla
- `DesignStyle` - Estilo (futurista, retro, minimalista)

**Servicios de Dominio**:
- `DesignGenerationService` - Orquesta la generación de diseños
- `PromptBuilderService` - Construye prompts optimizados para IA

**Repositorios (Interfaces)**:
- `IDesignRepository` - Persistencia de diseños

**Eventos de Dominio**:
- `DesignGenerated` - Cuando se genera un nuevo diseño
- `DesignValidated` - Cuando un diseño pasa validación

##### 1.2 Marketplace Context

**Responsabilidad**: Gestionar compra/venta de diseños

**Entidades**:
- `Listing` - Oferta de diseño en venta
- `Purchase` - Compra realizada
- `Offer` - Oferta de compra

**Value Objects**:
- `Price` - Precio con moneda
- `Currency` - Tipo de moneda (ETH, USDC, etc.)
- `ListingStatus` - Estado del listing (active, sold, cancelled)

**Servicios de Dominio**:
- `ListingService` - Gestiona listings
- `PurchaseService` - Procesa compras
- `PricingService` - Calcula precios dinámicos

**Repositorios**:
- `IListingRepository`
- `IPurchaseRepository`

**Eventos**:
- `ListingCreated`
- `PurchaseCompleted`
- `OfferReceived`

##### 1.3 Blockchain Context

**Responsabilidad**: Interacción con blockchain y NFTs

**Entidades**:
- `NFT` - Representación de NFT en el dominio
- `Transaction` - Transacción blockchain
- `SmartContract` - Contrato inteligente

**Value Objects**:
- `WalletAddress` - Dirección de wallet
- `TokenId` - ID del token NFT
- `TransactionHash` - Hash de transacción
- `Network` - Red blockchain (Ethereum, Polygon)

**Servicios de Dominio**:
- `NFTMintingService` - Gestiona el minting de NFTs
- `BlockchainTransactionService` - Gestiona transacciones
- `OwnershipService` - Verifica ownership

**Repositorios**:
- `INFTRepository`
- `ITransactionRepository`

**Eventos**:
- `NFTMinted`
- `OwnershipTransferred`
- `TransactionConfirmed`

##### 1.4 User Management Context

**Responsabilidad**: Gestión de usuarios y autenticación

**Entidades**:
- `User` - Usuario del sistema
- `UserProfile` - Perfil de usuario
- `Wallet` - Wallet asociada a usuario

**Value Objects**:
- `Email` - Email validado
- `Username` - Nombre de usuario
- `WalletAddress` - Dirección de wallet

**Servicios de Dominio**:
- `UserRegistrationService`
- `WalletLinkingService`
- `ProfileService`

**Repositorios**:
- `IUserRepository`

**Eventos**:
- `UserRegistered`
- `WalletLinked`

##### 1.5 Production Context

**Responsabilidad**: Gestión de producción física

**Entidades**:
- `ProductionOrder` - Orden de producción
- `Manufacturer` - Fabricante
- `ProductionStatus` - Estado de producción

**Value Objects**:
- `OrderStatus` - Estado de orden
- `ShippingAddress` - Dirección de envío

**Servicios de Dominio**:
- `ProductionOrderService`
- `ManufacturerIntegrationService`

**Repositorios**:
- `IProductionOrderRepository`

**Eventos**:
- `ProductionOrderCreated`
- `ProductionCompleted`

### 2. Application Layer (Capa de Aplicación)

Orquesta los casos de uso usando servicios de dominio.

**Casos de Uso**:
- `GenerateDesignUseCase`
- `ListDesignForSaleUseCase`
- `PurchaseDesignUseCase`
- `MintNFTUseCase`
- `LinkWalletUseCase`

**DTOs (Data Transfer Objects)**:
- `DesignDTO`
- `ListingDTO`
- `PurchaseDTO`
- `NFTDTO`

### 3. Infrastructure Layer (Capa de Infraestructura)

Implementaciones concretas de interfaces del dominio.

**Implementaciones**:
- `StableDiffusionAIService` - Implementa generación de IA
- `EthereumBlockchainService` - Implementa interacción blockchain
- `PrismaDesignRepository` - Implementa repositorio con Prisma
- `IPFSService` - Almacenamiento descentralizado
- `MetaMaskWalletService` - Integración con MetaMask

### 4. Presentation Layer (Capa de Presentación)

API REST y Frontend.

**Controllers**:
- `DesignController`
- `MarketplaceController`
- `BlockchainController`
- `UserController`

## 🔄 Flujo de Datos

```
Request → Controller → UseCase → Domain Service → Repository → Database
                                    ↓
                              Domain Events → Event Handlers
```

## 📦 Shared Kernel

Elementos compartidos entre bounded contexts:

- `ValueObjects`: `UUID`, `Timestamp`, `Money`
- `Events`: `DomainEvent` base class
- `Interfaces`: Interfaces comunes

## 🎯 Principios DDD Aplicados

1. **Ubiquitous Language**: Términos del dominio usados consistentemente
2. **Aggregates**: Agregados con raíces bien definidas
3. **Domain Events**: Comunicación asíncrona entre contextos
4. **Bounded Contexts**: Contextos claramente delimitados
5. **Anti-Corruption Layer**: Protección contra sistemas externos


