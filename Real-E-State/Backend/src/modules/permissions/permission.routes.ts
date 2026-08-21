import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './permission.controller';
import { createPermissionSchema, updatePermissionSchema } from './permission.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('super_admin'));

router.post('/', validate(createPermissionSchema), controller.createPermission);
router.get('/', controller.getPermissions);
router.get('/:id', controller.getPermissionById);
router.put('/:id', validate(updatePermissionSchema), controller.updatePermission);
router.delete('/:id', controller.deletePermission);

export default router;
