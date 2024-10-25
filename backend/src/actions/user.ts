const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const app = express();
const jwt = require('jsonwebtoken');    
app.use(express.json());
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: (error as Error).message }); // Include error message
    }
}


//creating user login endpoint


export const userLogin = async(req:Request,res:Response):Promise<any> => {
  const {username, password} = req.body;

    try{
        const user = await prisma.user.findUnique({
            where:{
                username,
            }
        })
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        //checking password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'});  
        }

        const token = jwt.sign ({id: user.id},process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({token, userId:user.id })
    } catch (e) {
        res.status(500).json({message: 'Server error'});    
    }
}



