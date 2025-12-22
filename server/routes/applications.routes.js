import express from 'express';
import {getApplications, createApplication, getApplication, updateApplication, deleteApplication} from '../controllers/application.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { applicationValidation } from '../utils/validators.js';
import { apiLimiter } from '../config/security.js';

const router = express.Router();

router.use(authenticate);
router.use(apiLimiter);

router.get('/', getApplications);
router.post('/', applicationValidation, createApplication);
router.get('/:id', getApplication);
router.put('/:id', applicationValidation, updateApplication);
router.delete('/:id', deleteApplication);

export default router;

