import express from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import nftRouter from './nft.routes';
import eventRouter from './event.routes';
import badgeRouter from './badge.routes';
import test from './test.routes';
import uploadRouter from './upload.routes';
import studentRouter from './student.routes';

const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/nft', nftRouter);
router.use('/event', eventRouter);
router.use('/badge', badgeRouter);
router.use('/test', test);
router.use('/file', uploadRouter);
router.use('/student', studentRouter);

export { router as apiRouter };
