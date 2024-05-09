import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import User, { IUser } from '../models/user.model';
import { AuthService } from '../services/auth.service';

import { config } from 'dotenv';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

import { WalletService } from '../services/wallet.service';
import { NFTService } from '../services/nft.service';
import { contractAddress } from '../utils/contracts';
import fs from 'fs';
import Student, { IStudent } from '../models/student.model';
import { StudentService } from '../services/student.service';

import { Web3 } from 'web3';
import Moralis from 'moralis';
config();

class AuthController {
  private userService: UserService;
  private authService: AuthService;
  private walletService: WalletService;
  private nftService: NFTService;
  private studentService: StudentService;
  private signer = [
    '0xBC05fE3CC58ed1976af13754c24383654531F3FF',
    '0x1854E30786ceb0964E46A82383cb170f4474E1e9'
  ];

  private accountFactory =
    contractAddress.ACCOUNT_FACTORY_ADDRESS.toLocaleLowerCase();

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
    this.walletService = new WalletService();
    this.nftService = new NFTService();
    this.studentService = new StudentService();
  }

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.body;
      const result = await this.authService.login(user.username, user.password);
      const loggedInUser = result.user;
      if (loggedInUser.role !== 'student') {
        res.status(200).json({ user: loggedInUser, token: result.token });
        return;
      }
      const student = await this.studentService.getStudentByStudentId(
        loggedInUser.username
      );

      let sdk: ThirdwebSDK | undefined;
      let txHash: string | undefined;
      let nftOwned: any | undefined;

      if (student.baseNFT.tokenId !== null && !student.baseNFT.isClaimed) {
        sdk = await this.walletService.getLocalWallet(student);
        const nft = await this.nftService.claimERC1155(
          contractAddress.NFT_MOD_ADDRESS,
          student.baseNFT.tokenId as number,
          1,
          sdk
        );

        nftOwned = nft.nftOwned;
        const { metadata } = nft.nftOwned[0];
        console.log('metadata', metadata);
        txHash = nft.tx.receipt.transactionHash;
        // console.log('nftOwned', nftOwned);

        if (txHash) {
          // update student baseNFT and txHash
          const updatedStudent = await Student.findOneAndUpdate(
            { studentId: loggedInUser.username },
            {
              baseNFT: {
                contractAddress: contractAddress.NFT_MOD_ADDRESS,
                tokenId: student.baseNFT.tokenId,
                isClaimed: true,
                metadata: metadata
              },
              txHash: txHash
            },
            { new: true }
          );
        }
      }

      res.status(200).json({ user: loggedInUser, token: result.token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const student: IStudent = req.body.personalInfo;
      const password = req.body.password;
      const createdStudent = await this.studentService.create(student);
      const user = {
        username: createdStudent.studentId,
        password: password,
        role: 'student'
      };
      const createdUser = await this.userService.createUser(user);

      const sdk = await this.walletService.getLocalWallet(createdStudent);
      const walletAddress = await sdk?.wallet.getAddress();

      const metaDatas = [
        {
          name: user.username,
          description: 'mod1 NFT',
          image: fs.readFileSync('src/assets/mod1.png')
        }
      ];
      const nftMinted = await this.nftService.lazyMintNFT(
        contractAddress.NFT_MOD_ADDRESS,
        metaDatas
      );

      const tokenId = nftMinted.tokenId;
      const txHash = await this.nftService.setClaimForUser(tokenId, sdk);

      createdStudent.txHash = txHash;
      createdStudent.walletAddress = walletAddress;
      createdStudent.baseNFT = {
        contractAddress: contractAddress.NFT_MOD_ADDRESS,
        tokenId: tokenId,
        isClaimed: false,
        metadata: {
          name: metaDatas[0].name,
          image: 'src/assets/mod1.png',
          description: metaDatas[0].description
        }
      };

      createdStudent.save();

      res.status(201).send({ createdStudent, txHash });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getLoggedInUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.user as IUser;
      const student = await this.studentService.getStudentByStudentId(
        user.username
      );
      const sdk = await this.walletService.getLocalWallet(student);
      // console.log('here:', sdk);
      //get local signer
      const localSigner = await sdk.getPublisher().getSigner();
      console.log('localSigner:', localSigner);

      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let firstCond = false;
      let secondCond = false;
      const studentId = req.user?.username as string;
      const student =
        await this.studentService.getStudentByStudentId(studentId);

      const sdk = await this.walletService.getLocalWallet(student);
      const walletAddress = (await sdk?.wallet.getAddress()).toLowerCase();
      const nftOwned = await this.nftService.getNFTsOwned(
        contractAddress.NFT_MOD_ADDRESS,
        sdk
      );

      const txHash = student.txHash;
      console.log('txHash:', txHash);

      const internalTx = await this.getInternalTransaction(txHash);
      const create2Tx = internalTx?.find(
        (tx: any) => tx.type.toLowerCase() === 'create2'
      );
      console.log('Create2:', create2Tx);

      console.log('NFTs owned:', nftOwned);
      if (nftOwned.length > 0) {
        firstCond = true;
      }
      console.log('Wallet Address:', walletAddress);
      console.log('create2Tx:', create2Tx?.from, create2Tx?.to);
      if (
        create2Tx?.from == this.accountFactory &&
        create2Tx?.to == walletAddress
      ) {
        secondCond = true;
      }
      if (firstCond && secondCond) {
        const verifyLog = {
          result: true,
          walletAddress: walletAddress,
          user: student.firstName + ' ' + student.lastName,
          nftOwned: nftOwned.length,
          txHash: txHash,
          blockNumber: create2Tx?.block_number,
          createBy: create2Tx?.from
        };
        res.status(200).json(verifyLog);
      } else {
        const verifyLog = {
          result: false,
          user: 'User not verified'
        };
        res.status(200).json(verifyLog);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getTransactionDetails = async (hash: string) => {
    const web3 = new Web3(
      'https://eth-sepolia.g.alchemy.com/v2/C-iH6l9a5EvniW6g_o3Q0oFHOJLgG3l5'
    );
    try {
      // Retrieve transaction details using web3.eth.getTransaction
      const transaction = await web3.eth.getTransaction(hash);

      if (!transaction) {
        console.log(`Transaction with hash ${hash} not found.`);
        return;
      }

      console.log('Transaction Details:');
      console.log('---------------------');
      console.log(`Chain ID: ${transaction.chainId}`);
      console.log(`Block Number: ${transaction.blockNumber}`);
      console.log(`From: ${transaction.from}`);
      console.log(`To: ${transaction.to}`);
      console.log(`Value (Wei): ${transaction.value}`);
      console.log(`Gas Price (Wei): ${transaction.gasPrice}`);
      console.log(`Gas Used: ${transaction.gas}`);
      //console.log(`Input Data: ${transaction.input}`);
      console.log(`Nonce: ${transaction.nonce}`);
      console.log(`Transaction Hash: ${transaction.hash}`);
      console.log('---------------------');
      const shortTx = {
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        gasPrice: transaction.gasPrice,
        gas: transaction.gas,
        nonce: transaction.nonce,
        hash: transaction.hash
      };
      return shortTx;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  getInternalTransaction = async (hash: string) => {
    try {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY
      });

      const sepolia = '0xaa36a7';
      const polygonAmoy = '0x13882';

      const response = await Moralis.EvmApi.transaction.getInternalTransactions(
        {
          chain: polygonAmoy,
          transactionHash: hash
        }
      );

      console.log(response.raw);
      return response.raw;
    } catch (e) {
      console.error(e);
    }
  };
}

export { AuthController };
