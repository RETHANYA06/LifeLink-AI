import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import jwksClient from 'jwks-rsa';
import User from '../models/User';

const region = process.env.AWS_REGION || 'us-east-1';
const userPoolId = process.env.COGNITO_USER_POOL_ID || '';

const client = jwksClient({
    jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
});

function getKey(header: any, callback: any) {
    client.getSigningKey(header.kid, function (err, key) {
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            jwt.verify(token, getKey, {
                issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
                algorithms: ['RS256']
            }, async (err, decoded: any) => {
                if (err) {
                    return res.status(401).json({ message: 'Not authorized, token failed', error: err.message });
                }

                // Fetch user from MongoDB using email from Cognito token
                const user = await User.findOne({ email: decoded.email });
                if (!user) {
                    return res.status(401).json({ message: 'User not found in local database' });
                }

                // Standardize req.user for other controllers
                (req as any).user = {
                    ...decoded,
                    id: user._id,
                    role: user.role
                };

                next();
            });

        } catch (error) {
            console.error('Auth Middleware Error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
