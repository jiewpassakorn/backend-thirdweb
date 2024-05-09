import express, { Router } from 'express';

import { UserController } from '../controllers/user.controller';
import { AuthTokenMiddleware } from '../middlewares/authToken.middleware';
import { upload } from '../middlewares/upload.middleware';

const router: Router = express.Router();
const userController = new UserController();

const authToken = new AuthTokenMiddleware();

router.post('/getAllUsers', authToken.verifyToken, userController.getAllUsers);
router.post('/getUserById', userController.getUserById);
router.post('/createUser', userController.createUser);
router.post('/updateUser', userController.updateUser);

router.post('/deleteUser', userController.deleteUser);

export default router;
