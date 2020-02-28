import express from 'express';
// eslint-disable-next-line prettier/prettier
import {userSignUp, userSignIn, viewAllMentors, viewSpecificMentor} from '../controllers/users';
import authoriseUser from '../middlewares/authorisation';

const userRouter = express.Router();

userRouter.post('/auth/signup', userSignUp);
userRouter.post('/auth/signin', userSignIn);
userRouter.get('/mentors', authoriseUser, viewAllMentors);
userRouter.get('/mentors/:mentorId', authoriseUser, viewSpecificMentor);

export default userRouter;
