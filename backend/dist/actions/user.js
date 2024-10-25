"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.createUser = void 0;
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = yield prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = yield bcrypt.hash(password, 10);
        // Create new user
        const user = yield prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message }); // Include error message
    }
});
exports.createUser = createUser;
//creating user login endpoint
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                username,
            }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        //checking password
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ token, userId: user.id });
    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.userLogin = userLogin;
