import express from 'express';
import userRouter from './users-routes';
import mentorRouter from './mentors-routes';

const router = express.Router();

router.use('/api/v1', userRouter);
router.use('/api/v1', mentorRouter);

export default router;
