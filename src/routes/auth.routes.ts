import express, { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthTokenMiddleware } from '../middlewares/authToken.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

const router: Router = express.Router();
const authController = new AuthController();

const authToken = new AuthTokenMiddleware();
const roleMiddleware = new RoleMiddleware();

router.post('/login', authController.login);
router.post(
  '/register',
  authToken.verifyToken,
  roleMiddleware.checkAdminRole,
  authController.register
);
router.post('/user', authToken.verifyToken, authController.getLoggedInUser);
router.post('/verify', authToken.verifyToken, authController.verifyUser);

export default router;
