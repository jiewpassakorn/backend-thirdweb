import { PolygonAmoyTestnet } from '@thirdweb-dev/chains';
import { IUser } from '../models/user.model';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { LocalWalletNode } from '@thirdweb-dev/wallets/evm/wallets/local-wallet-node';
import { MyStorage } from '../utils/localWallet';
import {
  SmartWallet,
  SmartWalletConfig,
  getSmartWalletAddress
} from '@thirdweb-dev/wallets';
import { ACTIVE_CHAIN } from '../config/chain';
import { Contract, contractAddress } from '../utils/contracts';
import { IStudent } from '../models/student.model';

class WalletService {
  private secretKey = process.env.THIRDWEB_SECRET_KEY as string;
  private contract: Contract;

  constructor() {
    this.contract = new Contract();
  }

  async getLocalWallet(student: IStudent) {
    try {
      const personalLocalWallet = await this.createLocalWallet(student);

      const personalLocalWalletAddress = await personalLocalWallet.getAddress();
      const sdk = await this.connectToSmartWallet(personalLocalWallet);
      const smartWalletAddress = await sdk.wallet.getAddress();

      console.log('personalLocalWalletAddress: ', personalLocalWalletAddress);
      console.log('Smart Account address:', smartWalletAddress);
      console.log('Balance:', (await sdk.wallet.balance()).displayValue);

      return sdk;
    } catch (error) {
      throw new Error(`Error creating local wallet: ${error}`);
    }
  }

  private async createLocalWallet(student: IStudent) {
    try {
      if (!this.secretKey) {
        throw new Error('No API Key found');
      }
      let storage = new MyStorage();
      storage.setId(student);

      const personalLocalWallet = new LocalWalletNode({
        storage: storage
      });

      await personalLocalWallet.loadOrCreate({
        strategy: 'encryptedJson',
        password: 'password'
      });
      return personalLocalWallet;
    } catch (error) {
      throw new Error(`Error creating local wallet: ${error}`);
    }
  }

  private async connectToSmartWallet(personalLocalWallet: LocalWalletNode) {
    const config: SmartWalletConfig = {
      chain: ACTIVE_CHAIN,
      factoryAddress: contractAddress.ACCOUNT_FACTORY_ADDRESS,
      secretKey: this.secretKey,
      gasless: true
    };

    const smartWallet = new SmartWallet(config);
    const newSmartWallet = await smartWallet.connect({
      personalWallet: personalLocalWallet
    });
    console.log('connectToSmartWallet:', newSmartWallet);

    return ThirdwebSDK.fromWallet(smartWallet, ACTIVE_CHAIN, {
      secretKey: this.secretKey
    });
  }
}

export { WalletService };
