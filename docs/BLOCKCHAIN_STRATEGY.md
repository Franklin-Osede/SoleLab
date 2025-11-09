# Estrategia Blockchain - SoleLab

## 🎯 Objetivos

1. **NFTs de Diseños**: Cada diseño único es un NFT
2. **Marketplace Descentralizado**: Compra/venta sin intermediarios
3. **Royalties**: Creadores reciben royalties en cada venta
4. **Ownership Verificable**: Propiedad verificable en blockchain
5. **Portfolio Showcase**: Mostrar colección NFT en portafolio

## 🏗️ Arquitectura Blockchain

### Smart Contracts

#### 1. SoleNFT.sol (ERC-721)

**Responsabilidad**: Minting y gestión de NFTs de diseños

**Funcionalidades**:
- Mint NFT para diseño generado
- Transfer ownership
- Metadata URI (IPFS)
- Royalties integrados

**Eventos**:
```solidity
event DesignMinted(uint256 indexed tokenId, address indexed creator, string metadataURI);
event OwnershipTransferred(uint256 indexed tokenId, address from, address to);
```

#### 2. SoleMarketplace.sol

**Responsabilidad**: Marketplace descentralizado

**Funcionalidades**:
- List NFT for sale
- Buy NFT
- Make offer
- Cancel listing
- Withdraw funds

**Eventos**:
```solidity
event ListingCreated(uint256 indexed tokenId, address indexed seller, uint256 price);
event PurchaseCompleted(uint256 indexed tokenId, address buyer, address seller, uint256 price);
```

#### 3. SoleRoyalties.sol

**Responsabilidad**: Sistema de royalties

**Funcionalidades**:
- Configurar royalties por token
- Distribuir royalties automáticamente
- Withdraw royalties acumulados

## 🔗 Integración con Backend

### Flujo de Minting

```
1. Usuario genera diseño
   ↓
2. Backend guarda diseño en IPFS
   ↓
3. Backend llama a Smart Contract para mint
   ↓
4. Smart Contract emite NFT
   ↓
5. Backend guarda tokenId y transaction hash
   ↓
6. Usuario recibe NFT en su wallet
```

### Flujo de Compra

```
1. Usuario selecciona NFT en marketplace
   ↓
2. Frontend conecta con MetaMask
   ↓
3. Usuario aprueba transacción
   ↓
4. Smart Contract ejecuta compra
   ↓
5. NFT transferido a comprador
   ↓
6. Fondos transferidos a vendedor (menos royalties)
   ↓
7. Backend actualiza estado
```

## 🛠️ Stack Tecnológico

### Smart Contracts
- **Solidity** ^0.8.20
- **OpenZeppelin** - Contratos base seguros
- **Hardhat** - Desarrollo y testing

### Integración
- **Ethers.js** v6 - Interacción con blockchain
- **Web3.js** (alternativa) - Si prefieres Web3.js
- **MetaMask** - Wallet integration

### Redes
- **Ethereum Sepolia** - Testnet para desarrollo
- **Polygon Mumbai** - Testnet L2 (costos bajos)
- **Ethereum Mainnet** - Producción (futuro)
- **Polygon Mainnet** - Producción L2 (recomendado)

### Almacenamiento
- **IPFS** - Metadatos y imágenes descentralizados
- **Pinata** - Pinning service para IPFS

## 📦 Estructura de Contratos

```
contracts/
├── interfaces/
│   ├── ISoleNFT.sol
│   ├── ISoleMarketplace.sol
│   └── ISoleRoyalties.sol
├── SoleNFT.sol
├── SoleMarketplace.sol
├── SoleRoyalties.sol
└── mocks/
    └── MockERC20.sol (para testing)
```

## 🧪 Testing de Contratos

### Estrategia

1. **Unit Tests**: Funciones individuales
2. **Integration Tests**: Interacción entre contratos
3. **Gas Optimization**: Medir y optimizar gas
4. **Security Tests**: Vulnerabilidades comunes

### Ejemplo de Test

```typescript
// tests/contracts/SoleNFT.test.ts
describe('SoleNFT', () => {
  let soleNFT: SoleNFT;
  let owner: Signer;
  let user: Signer;
  
  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const SoleNFTFactory = await ethers.getContractFactory('SoleNFT');
    soleNFT = await SoleNFTFactory.deploy();
  });
  
  describe('Minting', () => {
    it('should mint NFT to creator', async () => {
      const metadataURI = 'ipfs://Qm...';
      await soleNFT.mint(user.address, metadataURI);
      
      expect(await soleNFT.ownerOf(1)).to.equal(user.address);
      expect(await soleNFT.tokenURI(1)).to.equal(metadataURI);
    });
    
    it('should emit DesignMinted event', async () => {
      await expect(soleNFT.mint(user.address, 'ipfs://...'))
        .to.emit(soleNFT, 'DesignMinted')
        .withArgs(1, user.address, 'ipfs://...');
    });
  });
});
```

## 🔐 Seguridad

### Mejores Prácticas

1. **Reentrancy Guards**: Protección contra reentrancy attacks
2. **Access Control**: Solo funciones autorizadas
3. **Input Validation**: Validar todos los inputs
4. **Gas Optimization**: Evitar loops costosos
5. **Upgradeability**: Considerar proxies (si necesario)

### Auditoría

- **Slither** - Análisis estático
- **Mythril** - Análisis de seguridad
- **Auditoría profesional** - Antes de mainnet

## 💰 Modelo Económico

### Fees

- **Minting Fee**: 0.01 ETH (o equivalente)
- **Marketplace Fee**: 2.5% de cada venta
- **Royalty**: 5-10% para creador (configurable)

### Gas Optimization

- Usar L2 (Polygon) para costos bajos
- Batch operations cuando sea posible
- Optimizar storage usage

## 📊 Metadatos NFT (IPFS)

### Estructura JSON

```json
{
  "name": "Futuristic Air Jordan #1234",
  "description": "Diseño único generado con IA",
  "image": "ipfs://Qm...",
  "attributes": [
    {
      "trait_type": "Style",
      "value": "Futuristic"
    },
    {
      "trait_type": "Color Palette",
      "value": "Neon"
    },
    {
      "trait_type": "Generation Model",
      "value": "Stable Diffusion v2.1"
    }
  ],
  "external_url": "https://solelab.io/design/1234",
  "creator": "0x...",
  "created_at": "2024-01-15T10:00:00Z"
}
```

## 🚀 Deployment Strategy

### Desarrollo
1. Hardhat Network (local)
2. Sepolia Testnet
3. Mumbai Testnet

### Producción
1. Polygon Mainnet (recomendado - bajos costos)
2. Ethereum Mainnet (si se necesita máxima seguridad)

### Scripts

```bash
# Compilar
npx hardhat compile

# Test
npx hardhat test

# Deploy a testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Verify en Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## 📱 Frontend Integration

### Web3 Provider Setup

```typescript
// lib/web3.ts
import { ethers } from 'ethers';

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('MetaMask no detectado');
};

export const connectWallet = async () => {
  const provider = getProvider();
  await provider.send('eth_requestAccounts', []);
  return provider;
};
```

### Interacción con Contratos

```typescript
// lib/contracts.ts
import { ethers } from 'ethers';
import SoleNFTABI from '../contracts/abis/SoleNFT.json';

export const getSoleNFTContract = async (address: string) => {
  const provider = await connectWallet();
  const signer = await provider.getSigner();
  return new ethers.Contract(address, SoleNFTABI, signer);
};

export const mintNFT = async (contract: Contract, to: string, uri: string) => {
  const tx = await contract.mint(to, uri);
  await tx.wait();
  return tx.hash;
};
```

## 📈 Roadmap Blockchain

### Fase 1: MVP
- [ ] Contrato ERC-721 básico
- [ ] Minting desde backend
- [ ] Visualización en frontend

### Fase 2: Marketplace
- [ ] Contrato de marketplace
- [ ] List/Buy functionality
- [ ] Integración con wallet

### Fase 3: Avanzado
- [ ] Sistema de royalties
- [ ] Offers/Bids
- [ ] Staking/Auctions

### Fase 4: Optimización
- [ ] Gas optimization
- [ ] L2 migration
- [ ] Batch operations


