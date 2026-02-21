import express from 'express';
import { register, login, verifyEmail } from '../controllers/authController';

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register as any);
router.post('/login', login as any);
router.post('/verify-email', verifyEmail as any);

export default router;
