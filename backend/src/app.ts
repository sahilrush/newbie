import express from 'express';  
const app = express();
app.use(express.json());
import { userRouter } from './route/user';

app.use('/api', userRouter);

export default app;