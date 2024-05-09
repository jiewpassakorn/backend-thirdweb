import mongoose, { Document } from 'mongoose';
import ERC1155, { IMetadata, IERC1155 } from './nft.model';

export interface IBadge extends IERC1155, Document {}

const badgeSchema = new mongoose.Schema(ERC1155.schema.obj, {});

const Badge = mongoose.model<IBadge>('Badge', badgeSchema);

export default Badge;
