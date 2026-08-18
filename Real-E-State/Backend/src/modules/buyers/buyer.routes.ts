import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './buyer.controller';
import { createBuyerSchema, updateBuyerSchema } from './buyer.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('company'));

router.post('/', validate(createBuyerSchema), controller.createBuyer);
router.get('/', controller.getBuyers);
router.get('/:id', controller.getBuyerById);
router.put('/:id', validate(updateBuyerSchema), controller.updateBuyer);
router.delete('/:id', controller.deleteBuyer);

export default router;
