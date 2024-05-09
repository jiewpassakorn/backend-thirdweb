import express, { Router } from 'express';
import { AuthTokenMiddleware } from '../middlewares/authToken.middleware';

const router: Router = express.Router();
// const adminController = new AdminController();

const authToken = new AuthTokenMiddleware();

export default router;
