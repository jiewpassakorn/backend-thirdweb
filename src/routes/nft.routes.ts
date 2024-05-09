import express, { Router } from 'express';

import { NFTController } from '../controllers/nft.controller';
import { AuthTokenMiddleware } from '../middlewares/authToken.middleware';

const router: Router = express.Router();
const nftController = new NFTController();

const authToken = new AuthTokenMiddleware();

router.post(
  '/updateMetadataModId',
  authToken.verifyToken,
  nftController.updateMetadataModId
);

// router.post(
//   '/setClaimForUser',
//   authToken.verifyToken,
//   nftController.setClaimForUser
// );

export default router;
