// //         // Generate JWT token  

// import { Request, Response } from 'express';    

// export const authenticateJWT = (req:Request, res:Response, next: () => void) => {
//     const token = req.header('Authorization')?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'Access denied' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid token' });
//         }
//         req.user = user;
//         next();
//     });
// };

