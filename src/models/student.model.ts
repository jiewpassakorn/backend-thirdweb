import mongoose, { Document } from 'mongoose';

import { IMetadata } from './nft.model';

interface IBaseNFT {
  contractAddress: string;
  tokenId: number;
  metadata: IMetadata;
  isClaimed: boolean;
}
export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  studentId: string;
  faculty: string;
  department: string;
  year: number;
  email: string;
  image: string;
  localWallet: string;
  walletAddress?: string;
  baseNFT: IBaseNFT;
  txHash: string;
}

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  studentId: { type: String, required: true },
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  email: { type: String, required: true },
  image: { type: String, required: false, default: '' },
  localWallet: { type: String, required: false, default: '' },
  walletAddress: { type: String, required: false, default: '' },
  baseNFT: {
    contractAddress: { type: String, required: false, default: '' },
    tokenId: { type: Number, required: false, default: null },
    metadata: {
      name: { type: String, required: false, default: '' },
      description: { type: String, required: false, default: '' },
      image: { type: String, required: false, default: '' }
    },
    isClaimed: { type: Boolean, required: true, default: false }
  },
  txHash: { type: String, required: false, default: '' }
});

const Student = mongoose.model<IStudent>('Student', studentSchema);

export default Student;
