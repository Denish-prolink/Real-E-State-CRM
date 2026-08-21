import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './agency.controller';
import { createAgencySchema, updateAgencySchema } from './agency.validation';

const router = Router();

router.use(authenticate);

// Super admin only routes
router.post(
  '/',
  authorizeRoles('super_admin'),
  validate(createAgencySchema),
  controller.createAgency,
);
router.get('/', authorizeRoles('super_admin'), controller.getAgencies);
router.delete('/:id', authorizeRoles('super_admin'), controller.deleteAgency);

// Routes that can be accessed by both super_admin and agency
router.post(
  '/upload',
  authorizeRoles('super_admin', 'agency'),
  upload.single('logo'),
  controller.uploadLogo,
);
router.get('/:id', authorizeRoles('super_admin', 'agency'), controller.getAgencyById);
router.put(
  '/:id',
  authorizeRoles('super_admin', 'agency'),
  validate(updateAgencySchema),
  controller.updateAgency,
);

export default router;
