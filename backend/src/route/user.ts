import express from 'express';  
import { createUser, deleteProfile, getUserProfile, updateUserProfile, userLogin } from '../actions/user';
import { authenticateJWT } from '../middleware';


export const userRouter = express.Router()
userRouter.post('/register',createUser);
userRouter.post('/login',userLogin);
userRouter.get('/profile',authenticateJWT,getUserProfile);
userRouter.put('/profile',authenticateJWT,updateUserProfile)
userRouter.delete('profile',authenticateJWT,deleteProfile)


