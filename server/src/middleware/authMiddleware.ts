import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import jwksClient from 'jwks-rsa';

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
            }, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Not authorized, token failed', error: err.message });
                }
                (req as any).user = decoded;
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
