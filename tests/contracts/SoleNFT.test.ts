import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SoleNFT } from '../typechain-types';

describe('SoleNFT', () => {
  let soleNFT: SoleNFT;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    const SoleNFTFactory = await ethers.getContractFactory('SoleNFT');
    soleNFT = await SoleNFTFactory.deploy(owner.address);
  });

  describe('Deployment', () => {
    it('should set the right owner', async () => {
      expect(await soleNFT.owner()).to.equal(owner.address);
    });

    it('should set initial minting fee', async () => {
      expect(await soleNFT.mintingFee()).to.equal(ethers.parseEther('0.01'));
    });

    it('should have correct name and symbol', async () => {
      expect(await soleNFT.name()).to.equal('SoleLab Design');
      expect(await soleNFT.symbol()).to.equal('SOLE');
    });
  });

  describe('Minting', () => {
    const tokenURI = 'ipfs://QmTest123';
    const mintingFee = ethers.parseEther('0.01');

    it('should mint NFT with correct fee', async () => {
      await expect(
        soleNFT.connect(user1).mint(user1.address, tokenURI, { value: mintingFee })
      )
        .to.emit(soleNFT, 'DesignMinted')
        .withArgs(0, user1.address, tokenURI);

      expect(await soleNFT.ownerOf(0)).to.equal(user1.address);
      expect(await soleNFT.tokenURI(0)).to.equal(tokenURI);
      expect(await soleNFT.getCreator(0)).to.equal(user1.address);
      expect(await soleNFT.totalSupply()).to.equal(1);
    });

    it('should increment creator token count', async () => {
      await soleNFT.connect(user1).mint(user1.address, tokenURI, { value: mintingFee });
      expect(await soleNFT.creatorTokenCount(user1.address)).to.equal(1);

      await soleNFT.connect(user1).mint(user1.address, 'ipfs://QmTest456', { value: mintingFee });
      expect(await soleNFT.creatorTokenCount(user1.address)).to.equal(2);
    });

    it('should reject minting with insufficient fee', async () => {
      const insufficientFee = ethers.parseEther('0.005');

      await expect(
        soleNFT.connect(user1).mint(user1.address, tokenURI, { value: insufficientFee })
      ).to.be.revertedWith('SoleNFT: Insufficient minting fee');
    });

    it('should reject minting with empty token URI', async () => {
      await expect(
        soleNFT.connect(user1).mint(user1.address, '', { value: mintingFee })
      ).to.be.revertedWith('SoleNFT: Token URI cannot be empty');
    });

    it('should allow minting with fee higher than required', async () => {
      const higherFee = ethers.parseEther('0.02');

      await expect(
        soleNFT.connect(user1).mint(user1.address, tokenURI, { value: higherFee })
      ).to.emit(soleNFT, 'DesignMinted');
    });
  });

  describe('Minting Fee Management', () => {
    it('should allow owner to update minting fee', async () => {
      const newFee = ethers.parseEther('0.02');
      await expect(soleNFT.setMintingFee(newFee))
        .to.emit(soleNFT, 'MintingFeeUpdated')
        .withArgs(newFee);

      expect(await soleNFT.mintingFee()).to.equal(newFee);
    });

    it('should reject non-owner from updating fee', async () => {
      const newFee = ethers.parseEther('0.02');
      await expect(
        soleNFT.connect(user1).setMintingFee(newFee)
      ).to.be.revertedWithCustomError(soleNFT, 'OwnableUnauthorizedAccount');
    });

    it('should reject zero fee', async () => {
      await expect(soleNFT.setMintingFee(0))
        .to.be.revertedWith('SoleNFT: Fee must be greater than 0');
    });
  });

  describe('Withdrawal', () => {
    const mintingFee = ethers.parseEther('0.01');

    it('should allow owner to withdraw collected fees', async () => {
      await soleNFT.connect(user1).mint(user1.address, 'ipfs://QmTest', { value: mintingFee });
      await soleNFT.connect(user2).mint(user2.address, 'ipfs://QmTest2', { value: mintingFee });

      const balanceBefore = await ethers.provider.getBalance(owner.address);
      const contractBalance = await ethers.provider.getBalance(await soleNFT.getAddress());

      const tx = await soleNFT.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter).to.equal(balanceBefore + contractBalance - gasUsed);
    });

    it('should reject withdrawal when no funds', async () => {
      await expect(soleNFT.withdraw())
        .to.be.revertedWith('SoleNFT: No funds to withdraw');
    });

    it('should reject non-owner from withdrawing', async () => {
      await expect(
        soleNFT.connect(user1).withdraw()
      ).to.be.revertedWithCustomError(soleNFT, 'OwnableUnauthorizedAccount');
    });
  });
});


