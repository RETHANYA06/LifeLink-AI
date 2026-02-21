import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import * as cognitoService from '../services/cognitoService';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check if user exists in Mongo
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 1. Register in AWS Cognito
        await cognitoService.signUp(email, password, name);

        // 2. Create shadow user in MongoDB for profile data
        const user = new User({
            name,
            email,
            phone,
            role: role || 'patient'
            // We no longer store hashedPassword in Mongo as Cognito handles it
        });

        await user.save();

        res.status(201).json({
            message: 'Registration successful! Please check your email for the verification code.',
            email
        });
    } catch (error: any) {
        console.error('Registration Error:', error);
        res.status(400).json({
            message: error.message || 'Error during registration',
            code: error.code || 'InternalServerError'
        });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        await cognitoService.confirmSignUp(email, code);
        res.json({ message: 'Email verified successfully! You can now log in.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // 1. Authenticate with Cognito
        const authResult = await cognitoService.signIn(email, password);

        if (!authResult) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // 2. Fetch User Profile from Mongo
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User profile not found in local database' });
        }

        res.json({
            message: 'Login successful',
            token: authResult.IdToken, // Use IdToken for authentication
            refreshToken: authResult.RefreshToken,
            accessToken: authResult.AccessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error('Login Error:', error);
        res.status(400).json({ message: error.message || 'Invalid credentials' });
    }
};
