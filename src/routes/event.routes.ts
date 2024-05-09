import express, { Router } from 'express';

import { EventController } from '../controllers/event.controller';
import { AuthTokenMiddleware } from '../middlewares/authToken.middleware';
import { upload } from '../middlewares/upload.middleware';

const router: Router = express.Router();
const eventController = new EventController();

const authToken = new AuthTokenMiddleware();

router.post(
  '/registerForEvent',
  authToken.verifyToken,
  eventController.registerForEvent
);

router.post('/joinEvent', authToken.verifyToken, eventController.joinEvent);

router.post('/closeEvent', authToken.verifyToken, eventController.closeEvent);

router.post('/create', authToken.verifyToken, eventController.create);

router.post(
  '/uploadEventImage',
  authToken.verifyToken,
  upload.single('file'),
  eventController.uploadEventImage
);

router.post('/getAll', authToken.verifyToken, eventController.getAll);

router.post('/getById', authToken.verifyToken, eventController.getById);

router.post('/update', authToken.verifyToken, eventController.update);

router.post('/delete', authToken.verifyToken, eventController.delete);

router.post('/close', authToken.verifyToken, eventController.close);
export default router;
