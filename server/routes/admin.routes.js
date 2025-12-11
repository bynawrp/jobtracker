import express from 'express';
import { apiLimiter } from '../config/security.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { userUpdateValidation } from '../utils/validators.js';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/admin.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);
router.use(apiLimiter);

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', userUpdateValidation, updateUser);
router.delete('/users/:id', deleteUser);

export default router;