import { ThirdwebSDK, TransactionError } from '@thirdweb-dev/sdk';
import { Contract, contractAddress } from '../utils/contracts';

class NFTService {
  private contract: Contract;

  constructor() {
    this.contract = new Contract();
  }

  async lazyMintNFT(contractAddress: string, metaDatas: any) {
    try {
      const contract = await this.contract.initialize(contractAddress);
      const results = await contract.erc1155.lazyMint(metaDatas);

      const tokenId = results[0].id.toNumber();
      const nft = await results[0].data();

      if (!tokenId || !nft) {
        throw new Error('Badge not created');
      }
      return { results, tokenId, nft };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateMetadata(
    contractAddress: string,
    tokenId: string,
    metadata: any
  ) {
    const contract = await this.contract.initialize(contractAddress);
    const result = await contract.erc1155.updateMetadata(tokenId, metadata);
    return result;
  }

  async claimERC1155(
    contractAddress: string,
    tokenId: number,
    quantity: number,
    sdk: ThirdwebSDK
  ) {
    try {
      const contract = await this.contract.getContract(contractAddress, sdk);
      console.log(
        'NFT Owned',
        await contract.erc1155.getOwned(await sdk.wallet.getAddress())
      );

      console.log('Claiming NFT', contractAddress, tokenId, quantity);
      const tx = await contract.erc1155.claim(tokenId, quantity);
      const nftOwned = await contract.erc1155.getOwned(
        await sdk.wallet.getAddress()
      );
      if (!nftOwned) {
        throw new Error('Claiming NFT failed');
      }
      return { tx, nftOwned };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async setClaimForUser(tokenId: number, sdk: ThirdwebSDK) {
    try {
      const userAddress = await sdk.wallet.getAddress();
      const contract = await this.contract.initialize(
        contractAddress.NFT_MOD_ADDRESS
      );
      const presaleStartTime = new Date();
      const claimConditions = [
        {
          startTime: presaleStartTime,
          price: 0,
          snapshot: [userAddress],
          maxClaimablePerWallet: 1,
          maxClaimableSupply: 1
        }
      ];
      const tx = await contract.erc1155.claimConditions.set(
        tokenId,
        claimConditions
      );
      const txHash = tx.receipt.transactionHash;
      return txHash;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async setClaimPublicBadge(tokenId: number) {
    try {
      const contract = await this.contract.initialize(
        contractAddress.NFT_BADGE_ADDRESS
      );
      const presaleStartTime = new Date();
      const claimConditions = [
        {
          startTime: presaleStartTime,
          price: 0
        }
      ];
      const tx = await contract.erc1155.claimConditions.set(
        tokenId,
        claimConditions
      );
      if (!tx.receipt) {
        throw new Error('Claiming NFT failed');
      }
      const txHash = tx.receipt.transactionHash;
      return txHash;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getNFTsOwned(contractAddress: string, sdk: ThirdwebSDK) {
    try {
      const contract = await this.contract.getContract(contractAddress, sdk);
      const nftOwned = await contract.erc1155.getOwned(
        await sdk.wallet.getAddress()
      );
      if (!nftOwned) {
        throw new Error('NFT not found');
      }
      return nftOwned;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export { NFTService };
