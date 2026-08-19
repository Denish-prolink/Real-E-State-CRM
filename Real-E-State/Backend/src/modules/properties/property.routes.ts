import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './property.controller';
import { createPropertySchema, updatePropertySchema } from './property.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('agency', 'super_admin'));

router.post('/', validate(createPropertySchema), controller.createProperty);
router.get('/', controller.getProperties);
router.get('/:id', controller.getPropertyById);
router.put('/:id', validate(updatePropertySchema), controller.updateProperty);
router.delete('/:id', controller.deleteProperty);

export default router;
