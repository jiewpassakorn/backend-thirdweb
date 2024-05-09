import { WalletService } from './wallet.service';

import { Contract, contractAddress } from '../utils/contracts';
import { prepareContractCall, sendTransaction, resolveMethod } from 'thirdweb';
import { TransactionError } from '@thirdweb-dev/sdk';
import TransactionAdapter from '../utils/transaction.adapter';
import e from 'express';
import { IStudent } from '../models/student.model';

class EventService {
  private walletService: WalletService;
  private contract: Contract;
  private transactionAdapter: TransactionAdapter;

  constructor() {
    this.walletService = new WalletService();
    this.contract = new Contract();
    this.transactionAdapter = new TransactionAdapter();
  }

  async getAll() {
    const contract = await this.contract.initialize(
      contractAddress.NFT_EVENT_ADDRESS
    );
    const tx = await contract.call('getAllEvents', []);
    const events = this.transactionAdapter.adapterAllEvents(tx);
    return events;
  }

  async getById(id: number) {
    const contract = await this.contract.initialize(
      contractAddress.NFT_EVENT_ADDRESS
    );
    const tx = await contract.call('getEventById', [id]);
    const event = this.transactionAdapter.adaptGetEventById(tx);
    return event;
  }

  registerForEvent = async (eventId: number, student: IStudent) => {
    try {
      const sdk = await this.walletService.getLocalWallet(student);
      const contract = await this.contract.getContract(
        contractAddress.NFT_EVENT_ADDRESS,
        sdk
      );
      const args = [
        eventId,
        student.baseNFT.contractAddress,
        student.baseNFT.tokenId
      ];
      const tx = await contract.call('registerForEvent', args);
      const txHash = tx.receipt.transactionHash;
      return txHash;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  joinEvent = async (eventId: number, student: IStudent) => {
    try {
      const sdk = await this.walletService.getLocalWallet(student);
      const contract = await this.contract.getContract(
        contractAddress.NFT_EVENT_ADDRESS,
        sdk
      );
      const args = [eventId];
      const tx = await contract.call('joinEvent', args);
      const txHash = tx.receipt.transactionHash;
      return txHash;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  closeEvent = async (eventId: number) => {
    try {
      const contract = await this.contract.initialize(
        contractAddress.NFT_EVENT_ADDRESS
      );

      const tx = await contract.call('closeEvent', [eventId]);
      const txHash = tx.receipt.transactionHash;
      const status = tx.receipt.status;
      if (status === 1) {
        const badgeContract = await this.contract.initialize(
          contractAddress.NFT_BADGE_ADDRESS
        );
        // Step1 Get All Event fi
        const event = await this.getById(eventId);

        // Step2 Claim NFT amount = Participants.length

        const tokenId = event.rewardTokenId;
        const userAddress = event.participants;
        const walletAddress = await this.contract.getAdminWallet();
        const nftOwned = await badgeContract.erc1155.balanceOf(
          walletAddress,
          tokenId
        );
        let nftToClaim = 0;
        console.log('NFT Owned:', nftOwned.toNumber());
        console.log(
          'Before Set Claim NFT:',
          tokenId,
          userAddress,
          walletAddress,
          userAddress.length
        );
        if (nftOwned.toNumber() < userAddress.length) {
          nftToClaim =
            userAddress.length - nftOwned.toNumber() + nftOwned.toNumber();
          console.log('Not enough token NFT to Claim:', nftToClaim);
          const snapshot = {
            address: walletAddress,
            maxClaimable: userAddress.length
          };
          const presaleStartTime = new Date();
          const claimConditions = [
            {
              startTime: presaleStartTime,
              price: 0,
              snapshot: [snapshot],
              maxClaimablePerWallet: 0
            }
          ];

          const txClaim = await badgeContract.erc1155.claimConditions.set(
            tokenId,
            claimConditions
          );
          console.log('Claim NFT:', txClaim);

          const txAdminClaim = await badgeContract.erc1155.claim(
            tokenId,
            userAddress.length
          );
          console.log('Claim NFT to Admin:', txAdminClaim);
        }

        // Step3 Airdrop NFT to Participants
        console.log('Prepare to Airdrop NFT:', tokenId, userAddress);
        const txAirdrop = await badgeContract.erc1155.airdrop(
          tokenId,
          userAddress
        );
        console.log('Airdrop NFT Tx:', txAirdrop);

        return { txAirdrop };
      } else {
        throw new Error('Event not closed');
      }

      // return txHash;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  async create(event: any) {
    try {
      const contract = await this.contract.initialize(
        contractAddress.NFT_EVENT_ADDRESS
      );

      const args = [
        event.title,
        event.maxParticipants,
        event.registrationDeadline,
        event.cardContracts,
        event.rewardTokenId
      ];
      console.log('Creating event with args:', args);
      const tx = await contract.call('createEvent', args);
      const txHash = tx.receipt.transactionHash;
      if (tx.receipt.status === 1) {
        console.log('Event created:', tx);
        return txHash;
      } else {
        console.log('Event not created:', tx);
        const error = new Error('Event not created');
        (error as any).status = 401;
        throw error;
      }
    } catch (error) {
      if ((error as any).status === 401) {
        throw error;
      }
      const errorReason = (error as TransactionError)?.reason;
      console.log('Error in create: ', errorReason);
      throw new Error(errorReason);
    }
  }

  async update(event: any) {
    // Update event
  }

  async delete(id: string) {
    // Delete event
  }

  async close(id: number) {
    // const contract = await this.contract.initialize(
    //   contractAddress.NFT_EVENT_ADDRESS
    // );
    // const tx = await contract.call('closeEvent', [id]);
    // return tx;
  }
}

export { EventService };
