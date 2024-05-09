import express, { Router, Request, Response, NextFunction } from 'express';

import { TestController } from '../controllers/test.controller';
import { AuthTokenMiddleware } from '../middlewares/authToken.middleware';

const router: Router = express.Router();
const testController = new TestController();

const authToken = new AuthTokenMiddleware();

router.post('/test', authToken.verifyToken, testController.test);

export default router;
