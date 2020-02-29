import express from 'express';
import { acceptMentorship, rejectMentorship } from '../controllers/mentors';
import authoriseUser from '../middlewares/authorisation';

const mentorRouter = express.Router();

mentorRouter.patch(
  '/sessions/:sessionId/accept',
  authoriseUser,
  acceptMentorship
);

mentorRouter.patch(
  '/sessions/:sessionId/reject',
  authoriseUser,
  rejectMentorship
);

export default mentorRouter;
