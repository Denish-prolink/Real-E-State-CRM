import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './seller.controller';
import { createSellerSchema, updateSellerSchema } from './seller.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('agency'));

router.post('/', validate(createSellerSchema), controller.createSeller);
router.get('/', controller.getSellers);
router.get('/:id', controller.getSellerById);
router.put('/:id', validate(updateSellerSchema), controller.updateSeller);
router.delete('/:id', controller.deleteSeller);

export default router;
