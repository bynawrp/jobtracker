import express from 'express';
import {getApplications,createApplication,getApplication,updateApplication,deleteApplication} from '../controllers/application.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { applicationValidation, applicationUpdateValidation } from '../utils/validators.js';

const router = express.Router();

router.use(authenticate);
router.get('/', getApplications);
router.post('/', applicationValidation, createApplication);
router.get('/:id', getApplication);
router.put('/:id', applicationUpdateValidation, updateApplication);
router.delete('/:id', deleteApplication);

export default router;

