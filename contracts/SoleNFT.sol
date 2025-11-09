// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SoleNFT
 * @dev ERC-721 contract for SoleLab design NFTs
 */
contract SoleNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIdCounter;
    uint256 public mintingFee;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) public creators;
    
    // Mapping from creator to token count
    mapping(address => uint256) public creatorTokenCount;
    
    event DesignMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string metadataURI
    );
    
    event MintingFeeUpdated(uint256 newFee);
    
    constructor(address initialOwner) ERC721("SoleLab Design", "SOLE") Ownable(initialOwner) {
        _tokenIdCounter = 0;
        mintingFee = 0.01 ether; // Default minting fee
    }
    
    /**
     * @dev Mint a new NFT for a design
     * @param to Address to mint the NFT to
     * @param tokenURI IPFS URI of the metadata
     */
    function mint(address to, string memory tokenURI) 
        public 
        payable 
        nonReentrant 
        returns (uint256) 
    {
        require(msg.value >= mintingFee, "SoleNFT: Insufficient minting fee");
        require(bytes(tokenURI).length > 0, "SoleNFT: Token URI cannot be empty");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        creators[tokenId] = to;
        creatorTokenCount[to]++;
        
        emit DesignMinted(tokenId, to, tokenURI);
        
        return tokenId;
    }
    
    /**
     * @dev Get total number of minted tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Get creator of a token
     */
    function getCreator(uint256 tokenId) public view returns (address) {
        require(_ownerOf(tokenId) != address(0), "SoleNFT: Token does not exist");
        return creators[tokenId];
    }
    
    /**
     * @dev Update minting fee (only owner)
     */
    function setMintingFee(uint256 newFee) public onlyOwner {
        require(newFee > 0, "SoleNFT: Fee must be greater than 0");
        mintingFee = newFee;
        emit MintingFeeUpdated(newFee);
    }
    
    /**
     * @dev Withdraw collected fees (only owner)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "SoleNFT: No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "SoleNFT: Withdrawal failed");
    }
}


