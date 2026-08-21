import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './deal.controller';
import { createDealSchema, updateDealSchema } from './deal.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('agency', 'super_admin'));

router.post('/', validate(createDealSchema), controller.createDeal);
router.get('/', controller.getDeals);
router.get('/:id', controller.getDealById);
router.put('/:id', validate(updateDealSchema), controller.updateDeal);
router.delete('/:id', controller.deleteDeal);

export default router;
