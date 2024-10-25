//         // Generate JWT token  

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req:Request, res:Response, next: () => void)=> {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: 'JWT secret not configured' });
    }
    jwt.verify(token, secret, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};



