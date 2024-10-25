import express from 'express';  
import { createUser, userLogin } from '../actions/user';


export const userRouter = express.Router()
userRouter.post('/register',createUser);
userRouter.post('/login',userLogin);

