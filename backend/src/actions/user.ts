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

//user profile 




export const getUserProfile = async(req:Request,res:Response) => {

    try{

        const user = await prisma.user.findUnique({
            where:{ id: req.user.id},
            select:{
                id:true,
                username:true,  
                name:true,
                bio:true,
                profileImage:true,  
            }
        
         }
         
        )
        if(!user){
            res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(user); 
    } catch(e:any){
        res.status(500).json({message: 'Server error'});    
    }
      
}

//updating user profile


export const updateUserProfile = async(req:Request,res:Response) => {   
                        const {name,bio,profileImage} = req.body;  

                try{
                        const user = await prisma.user.update({
                            where:{id:req.user.id},
                            data:{
                                name,
                                bio,
                                profileImage
                            },
                        })
                        res.status(200).json({
                            message:"profile updated succcesfully"
                        })
                }catch(e){
                    res.status(500).json({message: 'Server error'});    
                }
         }



//deletiing user profile will be optional mostly 


export const deleteProfile = async (req: Request, res: Response) => {
    try {
        console.log("User ID:", req.user.id); // Debugging log
        await prisma.user.delete({
            where: { id: req.user.id },
        });
        res.status(200).json({
            message: "Profile deleted Successfully",
        });
    } catch (e) {
        console.error("Delete error:", e); // Log the error for debugging
        res.status(400).json({
            error: "Invalid error", // Change to more descriptive error message
        });
    }
};
