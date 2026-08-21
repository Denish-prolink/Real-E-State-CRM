import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './warehouse.controller';
import { createWarehouseSchema, updateWarehouseSchema } from './warehouse.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('agency'));

router.post('/', validate(createWarehouseSchema), controller.createWarehouse);
router.get('/', controller.getWarehouses);
router.get('/:id', controller.getWarehouseById);
router.put('/:id', validate(updateWarehouseSchema), controller.updateWarehouse);
router.delete('/:id', controller.deleteWarehouse);

export default router;
