import { NextFunction, Request, Response } from 'express';
import { NFTService } from '../services/nft.service';
import { CLIENT } from '../config/client';
import { Contract, contractAddress } from '../utils/contracts';
import { WalletService } from '../services/wallet.service';
import { IUser } from '../models/user.model';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import fs from 'fs';

class NFTController {
  private nftService: NFTService;
  private contract: Contract;
  private walletService: WalletService;

  constructor() {
    this.nftService = new NFTService();
    this.walletService = new WalletService();
    this.contract = new Contract();
  }

  // getOwnedBadge = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const sdk = await this.walletService.getLocalWallet(req.user as IUser);

  //     const contract = await this.contract.getContract(
  //       contractAddress.NFT_BADGE_ADDRESS,
  //       sdk
  //     );
  //     const nftOwned = await contract.erc1155.getOwned(
  //       await sdk.wallet.getAddress()
  //     );
  //     res.status(200).send(nftOwned);
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // };

  // setClaimForUser = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const { tokenId } = req.body;
  //     const sdk = await this.walletService.getLocalWallet(req.user as IUser);
  //     const txHash = await this.nftService.setClaimForUser(tokenId, sdk);
  //     res.status(200).send({ txHash: txHash });
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // };

  updateMetadataModId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { tokenId, metadata } = req.body;

      const tx = await this.nftService.updateMetadata(
        contractAddress.NFT_MOD_ADDRESS,
        tokenId,
        metadata
      );
      const txHash = tx.receipt.transactionHash;
      res.status(200).send({ txHash: txHash });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export { NFTController };
