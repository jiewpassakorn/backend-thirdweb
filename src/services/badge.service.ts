import Badge, { IBadge } from '../models/badge.model';
import mongoose, { set } from 'mongoose';
import User, { IUser } from '../models/user.model';
import { UserService } from './user.service';
import { ThirdwebSDK, TransactionError } from '@thirdweb-dev/sdk';
import { NFTService } from './nft.service';
import { WalletService } from './wallet.service';
import { Contract, contractAddress } from '../utils/contracts';
import fs from 'fs';
import path from 'path';
import { IMetadata } from '../models/nft.model';
import { IStudent } from '../models/student.model';

class BadgeService {
  private userService: UserService;
  private nftService: NFTService;
  private walletService: WalletService;
  private contract: Contract;
  constructor() {
    this.userService = new UserService();
    this.nftService = new NFTService();
    this.walletService = new WalletService();
    this.contract = new Contract();
  }

  getRandomBadgeImage(badgeImagesDir: string) {
    const badgeImageFiles = fs.readdirSync(badgeImagesDir);
    console.log('badgeImageFiles', badgeImageFiles);
    const randomImageFile =
      badgeImageFiles[Math.floor(Math.random() * badgeImageFiles.length)];
    console.log('randomImageFile', randomImageFile);
    return path.join(badgeImagesDir, randomImageFile);
  }

  async checkExist(badge: any) {
    try {
      const badgeExist = await Badge.findOne({ title: badge.title });
      return badgeExist;
    } catch (error) {
      console.log(error);
      throw new Error(`Database ${error}`);
    }
  }

  async create(badge: IMetadata) {
    try {
      const badgeImagesDir = 'src/assets/badges';
      const imageFilePath = this.getRandomBadgeImage(badgeImagesDir);
      const metaData = [
        {
          name: badge.name,
          description: badge.description,
          image: fs.readFileSync(imageFilePath)
        }
      ];
      const nftMinted = await this.nftService.lazyMintNFT(
        contractAddress.NFT_BADGE_ADDRESS,
        metaData
      );
      if (!nftMinted) {
        throw new Error('Badge not created');
      }
      const txHash = await this.nftService.setClaimPublicBadge(
        nftMinted.tokenId
      );
      return txHash;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const badges = await Badge.find();
      return badges;
    } catch (error) {
      console.log(error);
      throw new Error(`Database ${error}`);
    }
  }

  async getById(id: number) {
    try {
      const badge = await Badge.find({ tokenId: id });
      return badge;
    } catch (error) {
      console.log(error);
      throw new Error(`Database ${error}`);
    }
  }

  async update(badge: IBadge) {
    try {
      const updatedBadge = await Badge.findByIdAndUpdate(badge._id, badge, {
        new: true
      });
      return updatedBadge;
    } catch (error) {
      console.log(error);
      throw new Error(`Database ${error}`);
    }
  }

  async delete(id: string) {
    try {
      const badge = await Badge.findByIdAndDelete(id);
      if (!badge) {
        throw new Error('Badge not found');
      }
      return { message: 'Badge deleted' };
    } catch (error) {
      console.log(error);
      throw new Error(`Database ${error}`);
    }
  }

  async assignBadgeTo(address: string, badgeTokenId: number, quantity: number) {
    try {
      const badgeAddress = contractAddress.NFT_BADGE_ADDRESS;
      const contract = await this.contract.initialize(badgeAddress);

      const tx = await contract.erc1155.claimTo(
        address,
        badgeTokenId,
        quantity
      );
      const txHash = tx.receipt.transactionHash;
      return txHash;
    } catch (error) {
      console.log(error);
      throw new Error(`Database ${error}`);
    }
  }

  async assignBadgeToMultiWallet(addresses: string[], badgeTokenId: number) {
    try {
      const badgeAddress = contractAddress.NFT_BADGE_ADDRESS;
      const contract = await this.contract.initialize(badgeAddress);

      const tx = await contract.erc1155.airdrop(badgeTokenId, addresses);
      const txHash = tx.receipt.transactionHash;

      return txHash;
    } catch (error) {
      console.log(error);
      throw new Error(`Database ${error}`);
    }
  }

  // async assignBadge(userId: string, badgeTokenId: number) {
  //   try {
  //     // const result = await this.userService.getUserByStudentId(
  //     //   user.personalInfo.studentId
  //     // );

  //     if (!result) {
  //       throw new Error('User not found');
  //     }

  //     const sdk = await this.walletService.getLocalWallet(user);
  //     const nft = await this.nftService.claimERC1155(
  //       contractAddress.NFT_BADGE_ADDRESS,
  //       badgeTokenId,
  //       1,
  //       sdk
  //     );

  //     const lastNft = nft.nftOwned[nft.nftOwned.length - 1];
  //     if (!lastNft) {
  //       throw new Error('Badge not found');
  //     }

  //     return lastNft;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(`Database ${error}`);
  //   }
  // }

  getOwnedBadge = async (student: IStudent) => {
    try {
      const sdk = await this.walletService.getLocalWallet(student);

      const contract = await this.contract.getContract(
        contractAddress.NFT_MOD_ADDRESS,
        sdk
      );
      console.log('getAddress', await sdk.wallet.getAddress());
      const nftOwned = await contract.erc1155.getOwned(
        await sdk.wallet.getAddress()
      );
      return nftOwned;
    } catch (error) {
      const errorReason = (error as TransactionError)?.reason;
      console.log('Error in getOwnedBadge: ', errorReason);
      throw new Error(errorReason);
    }
  };
}

export { BadgeService };
