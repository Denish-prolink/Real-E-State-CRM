import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './unit.controller';
import { createUnitSchema, updateUnitSchema } from './unit.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('company', 'super_admin'));

router.post('/', validate(createUnitSchema), controller.createUnit);
router.get('/', controller.getUnits);
router.get('/:id', controller.getUnitById);
router.put('/:id', validate(updateUnitSchema), controller.updateUnit);
router.delete('/:id', controller.deleteUnit);

export default router;
