import mongoose, { Document } from 'mongoose';

export interface IMetadata {
  name: string;
  description: string;
  image: string;
}
export interface IERC1155 extends Document {
  contractAddress: string;
  tokenId: number;
  metadata: IMetadata;
  quantity: number;
}

const ERC1155Schema = new mongoose.Schema({
  contractAddress: { type: String, required: true },
  tokenId: { type: Number, required: true },
  metadata: { type: Object, required: true },
  quantity: { type: Number, required: true }
});

const ERC1155 = mongoose.model<IERC1155>('ERC1155', ERC1155Schema);

export default ERC1155;
