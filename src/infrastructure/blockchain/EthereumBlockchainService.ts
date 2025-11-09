import { ethers } from 'ethers';
// import { SoleNFT__factory } from '../../../../typechain-types'; // TODO: Generate after compiling contracts

/**
 * Servicio: EthereumBlockchainService
 * 
 * RAZÓN DE DISEÑO:
 * - Encapsula interacción con blockchain Ethereum
 * - Maneja detalles técnicos (providers, signers, contracts)
 * - Convierte errores de blockchain a errores de dominio
 * - Permite cambiar de red (Ethereum, Polygon) sin afectar dominio
 * 
 * PRINCIPIOS:
 * - Infrastructure Layer: Detalles técnicos aquí
 * - Error Handling: Errores técnicos convertidos a errores de dominio
 * - Abstraction: Oculta complejidad de ethers.js
 */
export interface BlockchainConfig {
  rpcUrl: string;
  contractAddress: string;
  privateKey?: string; // Para transacciones desde backend
}

export interface MintNFTRequest {
  to: string; // Dirección del destinatario
  tokenURI: string; // IPFS URI del metadata
  value: string; // Valor en ETH para minting fee
}

export interface MintNFTResponse {
  tokenId: number;
  transactionHash: string;
  blockNumber: number;
}

export class EthereumBlockchainService {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private contract: ethers.Contract;

  constructor(config: BlockchainConfig) {
    // Crear provider
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);

    // Crear signer si hay private key (para transacciones desde backend)
    if (config.privateKey) {
      this.signer = new ethers.Wallet(config.privateKey, this.provider);
    }

    // Crear instancia del contrato
    // TODO: Usar SoleNFT__factory después de compilar contratos
    // const contractFactory = SoleNFT__factory.connect(
    //   config.contractAddress,
    //   this.signer || this.provider
    // );
    // this.contract = contractFactory;
    
    // Temporal: usar Contract directamente hasta compilar
    this.contract = new ethers.Contract(
      config.contractAddress,
      [
        'function mint(address to, string memory tokenURI) external payable returns (uint256)',
        'function ownerOf(uint256 tokenId) external view returns (address)',
        'function getCreator(uint256 tokenId) external view returns (address)',
        'function mintingFee() external view returns (uint256)',
        'event DesignMinted(uint256 indexed tokenId, address indexed creator, string metadataURI)',
      ],
      this.signer || this.provider
    );
  }

  /**
   * Mint un NFT
   * 
   * @param request - Datos para minting
   * @returns Token ID y hash de transacción
   */
  async mintNFT(request: MintNFTRequest): Promise<MintNFTResponse> {
    if (!this.signer) {
      throw new Error('Signer required for minting. Provide privateKey in config.');
    }

    try {
      // Llamar función mint del contrato
      const tx = await this.contract.mint(request.to, request.tokenURI, {
        value: ethers.parseEther(request.value),
      });

      // Esperar confirmación
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error('Transaction receipt not found');
      }

      // Obtener tokenId del evento emitido
      const mintEvent = receipt.logs.find(
        (log: any) => log.topics[0] === ethers.id('DesignMinted(uint256,address,string)')
      );

      // Parsear tokenId del evento
      const tokenId = parseInt(mintEvent?.topics[1] || '0', 16);

      return {
        tokenId,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      // Convertir error técnico a error de dominio
      if (error instanceof Error) {
        throw new Error(`Blockchain transaction failed: ${error.message}`);
      }
      throw new Error('Unknown blockchain error');
    }
  }

  /**
   * Obtiene el owner de un token
   */
  async getOwnerOfToken(tokenId: number): Promise<string> {
    try {
      const owner = await this.contract.ownerOf(tokenId);
      return owner;
    } catch (error) {
      throw new Error(`Failed to get token owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obtiene el creador de un token
   */
  async getCreatorOfToken(tokenId: number): Promise<string> {
    try {
      const creator = await this.contract.getCreator(tokenId);
      return creator;
    } catch (error) {
      throw new Error(`Failed to get token creator: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Obtiene el minting fee actual
   */
  async getMintingFee(): Promise<string> {
    try {
      const fee = await this.contract.mintingFee();
      return ethers.formatEther(fee);
    } catch (error) {
      throw new Error(`Failed to get minting fee: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

