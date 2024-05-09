import express, { Router } from 'express';

import { BadgeController } from '../controllers/badge.controller';
import { AuthTokenMiddleware } from '../middlewares/authToken.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

const router: Router = express.Router();
const badgeController = new BadgeController();

const authToken = new AuthTokenMiddleware();
const roleMiddleware = new RoleMiddleware();

router.post(
  '/create',
  authToken.verifyToken,
  roleMiddleware.checkAdminRole,
  badgeController.create
);

router.post('/getAll', authToken.verifyToken, badgeController.getAll);

router.post('/getById', authToken.verifyToken, badgeController.getById);

router.post('/update', authToken.verifyToken, badgeController.update);

router.post('/delete', authToken.verifyToken, badgeController.delete);

router.post('/assignBadge', authToken.verifyToken, badgeController.assignBadge);

router.post(
  '/assignBadgeToMultiWallet',
  authToken.verifyToken,
  badgeController.assignBadgeToMultiWallet
);
// router.post(
//   '/assignBadgeLoggedUser',
//   authToken.verifyToken,
//   badgeController.assignBadgeLoggedUser
// );

// router.post(
//   '/getDefaultBadge',
//   authToken.verifyToken,
//   badgeController.getDefaultBadge
// );

router.post(
  '/getOwnedBadge',
  authToken.verifyToken,
  badgeController.getOwnedBadge
);

export default router;
