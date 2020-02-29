import express from 'express';
import acceptMentorship from '../controllers/mentors';
import authoriseUser from '../middlewares/authorisation';

const mentorRouter = express.Router();

mentorRouter.patch(
  '/sessions/:sessionId/accept',
  authoriseUser,
  acceptMentorship
);

export default mentorRouter;
