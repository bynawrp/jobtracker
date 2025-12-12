import express from 'express';
import { register, login, logout, getMe, updateProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { registerValidation, loginValidation, userUpdateValidation } from '../utils/validators.js';
import { authLimiter, apiLimiter } from '../config/security.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);

router.post('/logout', authenticate, apiLimiter, logout);
router.get('/me', authenticate, apiLimiter, getMe);
router.put('/profile', authenticate, apiLimiter, userUpdateValidation, updateProfile);

export default router;

