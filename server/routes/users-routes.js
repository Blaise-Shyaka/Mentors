import express from 'express';
// eslint-disable-next-line prettier/prettier
import {userSignUp, userSignIn} from '../controllers/users';

const userRouter = express.Router();

userRouter.post('/auth/signup', userSignUp);
userRouter.post('/auth/signin', userSignIn);

export default userRouter;
