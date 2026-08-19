import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './company.controller';
import { createCompanySchema, updateCompanySchema } from './company.validation';

const router = Router();

router.use(authenticate);

// Super admin only routes
router.post(
  '/',
  authorizeRoles('super_admin'),
  validate(createCompanySchema),
  controller.createCompany,
);
router.get('/', authorizeRoles('super_admin'), controller.getCompanies);
router.delete('/:id', authorizeRoles('super_admin'), controller.deleteCompany);

// Routes that can be accessed by both super_admin and company
router.post(
  '/upload',
  authorizeRoles('super_admin', 'agency'),
  upload.single('logo'),
  controller.uploadLogo,
);
router.get('/:id', authorizeRoles('super_admin', 'agency'), controller.getCompanyById);
router.put(
  '/:id',
  authorizeRoles('super_admin', 'agency'),
  validate(updateCompanySchema),
  controller.updateCompany,
);

export default router;
