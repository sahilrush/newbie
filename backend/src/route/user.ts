import express from 'express';  
import { createUser, deleteProfile, getUserProfile, updateUserProfile, userLogin } from '../actions/user';
import { authenticateJWT } from '../middleware';

export const userRouter = express.Router()
userRouter.post('/register',createUser);
userRouter.post('/login',userLogin);
//@ts-ignore
userRouter.get('/profile',authenticateJWT,getUserProfile);
//@ts-ignore
userRouter.put('/profile',authenticateJWT,updateUserProfile)
//@ts-ignore
userRouter.delete('/profile',authenticateJWT,deleteProfile)


