import express, { Router } from 'express';
import { AuthTokenMiddleware } from '../middlewares/authToken.middleware';
import { StudentController } from '../controllers/student.controller';
import { upload } from '../middlewares/upload.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

const router: Router = express.Router();
const studentController = new StudentController();
const roleMiddleware = new RoleMiddleware();

const authToken = new AuthTokenMiddleware();

router.post('/create', authToken.verifyToken, studentController.create);
router.post('/update', authToken.verifyToken, studentController.update);
router.post('/delete', authToken.verifyToken, studentController.delete);

router.post('/getStudent', authToken.verifyToken, studentController.getStudent);

router.post(
  '/uploadProfile/:studentId',
  authToken.verifyToken,
  roleMiddleware.checkAdminRole,
  upload.single('file'),
  studentController.uploadProfile
);

router.post(
  '/viewProfile/:studentId',
  authToken.verifyToken,
  studentController.viewProfile
);

export default router;
