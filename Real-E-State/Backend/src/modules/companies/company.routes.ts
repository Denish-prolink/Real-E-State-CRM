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
  authorizeRoles('SUPER_ADMIN'),
  validate(createCompanySchema),
  controller.createCompany,
);
router.get('/', authorizeRoles('SUPER_ADMIN'), controller.getCompanies);
router.delete('/:id', authorizeRoles('SUPER_ADMIN'), controller.deleteCompany);

// Routes that can be accessed by both super_admin and company
router.post(
  '/upload',
  authorizeRoles('SUPER_ADMIN', 'AGENCY'),
  upload.single('logo'),
  controller.uploadLogo,
);
router.get('/:id', authorizeRoles('SUPER_ADMIN', 'AGENCY'), controller.getCompanyById);
router.put(
  '/:id',
  authorizeRoles('SUPER_ADMIN', 'AGENCY'),
  validate(updateCompanySchema),
  controller.updateCompany,
);

export default router;
