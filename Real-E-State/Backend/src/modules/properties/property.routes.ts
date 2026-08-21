import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './property.controller';
import { createPropertySchema, updatePropertySchema } from './property.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('agency', 'super_admin'));

router.post(
  '/',
  upload.array('photos', 10),
  validate(createPropertySchema),
  controller.createProperty,
);
router.get('/', controller.getProperties);
router.get('/:id', controller.getPropertyById);
router.put(
  '/:id',
  upload.array('photos', 10),
  validate(updatePropertySchema),
  controller.updateProperty,
);
router.delete('/:id', controller.deleteProperty);

export default router;
