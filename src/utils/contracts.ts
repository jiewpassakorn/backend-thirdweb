import { SmartContract, ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ACTIVE_CHAIN } from '../config/chain';
import { BaseContract } from 'ethers';

// Sepolia
// export const contractAddress = {
//   ACCOUNT_FACTORY_ADDRESS: '0x27c97348CCE4FB0C2Aa10Fa758978b8e4a8FeFB4',
//   NFT_EVENT_ADDRESS: '0x33d0E396E3256310Bbe4cD9e233A1aFe1FC882db',
//   NFT_MOD_ADDRESS: '0x266b8b99fb387F10779ee9F3b4a3D00012f7a323',
//   NFT_BADGE_ADDRESS: '0xD1a1C627A7Cd077DcEB64cD767E9e03362071AEB'
// };

// PolygonAmoyTestnet
export const contractAddress = {
  ACCOUNT_FACTORY_ADDRESS: '0x27c97348CCE4FB0C2Aa10Fa758978b8e4a8FeFB4',
  NFT_EVENT_ADDRESS: '0x578511c7B939b630cab5f019190637Bb6F209221',
  NFT_MOD_ADDRESS: '0xEae43EFf1782D1082a3F25D48d19d3d0BdB2c454',
  NFT_BADGE_ADDRESS: '0xD1a1C627A7Cd077DcEB64cD767E9e03362071AEB'
};

export class Contract {
  private privateKey: string;
  private secretKey: string;
  private sdk: ThirdwebSDK;
  public contract: SmartContract<BaseContract> | null;

  constructor() {
    this.privateKey = process.env.WALLET_PRIVATE_KEY as string;
    this.secretKey = process.env.THIRDWEB_SECRET_KEY as string;

    this.sdk = ThirdwebSDK.fromPrivateKey(this.privateKey, ACTIVE_CHAIN, {
      secretKey: this.secretKey
    });
    this.contract = null;
  }

  async getAdminWallet() {
    return this.sdk.wallet.getAddress();
  }

  /* FOR ADMIN PERMISSION */
  async initialize(contractAddress: string) {
    try {
      this.contract = await this.sdk.getContract(contractAddress);
      return this.contract;
    } catch (error) {
      throw new Error(`Error initializing contract: ${error}`);
    }
  }

  /* FOR USER PERMISSION */
  async getContract(contractAddress: string, sdk: ThirdwebSDK) {
    const contract = await sdk.getContract(contractAddress);
    return contract;
  }
}
