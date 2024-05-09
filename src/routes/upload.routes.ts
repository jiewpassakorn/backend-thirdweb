import express, { NextFunction, Request, Response } from 'express';
import { AuthTokenMiddleware } from '../middlewares/authToken.middleware';
import { UploadController } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload.middleware';
const authToken = new AuthTokenMiddleware();
const uploadController = new UploadController();

const router = express.Router();

router.post(
  '/upload',
  authToken.verifyToken,
  upload.single('file'),
  uploadController.upload
);

router.get('/image/:filename', uploadController.viewFile);
router.post(
  '/delete/:filename',
  authToken.verifyToken,
  uploadController.deleteFile
);

export default router;
