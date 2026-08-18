import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';
import * as controller from './role.controller';
import { createRoleSchema, updateRoleSchema } from './role.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('company', 'super_admin'));

router.post('/', validate(createRoleSchema), controller.createRole);
router.get('/', controller.getRoles);
router.get('/:id', controller.getRoleById);
router.put('/:id', validate(updateRoleSchema), controller.updateRole);
router.delete('/:id', controller.deleteRole);

export default router;
