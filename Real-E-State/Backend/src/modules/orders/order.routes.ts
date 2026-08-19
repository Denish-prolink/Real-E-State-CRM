import { Router } from 'express';

import { authenticate, authorizeRoles } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import * as controller from './order.controller';
import { createOrderSchema, updateOrderSchema } from './order.validation';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('AGENCY', 'AGENT', 'STAFF', 'SUPER_ADMIN'));

router.post('/sell', validate(createOrderSchema), controller.createSellOrder);
router.get('/sell', controller.getSellOrders);

router.post('/purchase', validate(createOrderSchema), controller.createPurchaseOrder);
router.get('/purchase', controller.getPurchaseOrders);

router.post('/', validate(createOrderSchema), controller.createOrder);
router.get('/', controller.getOrders);
router.get('/:id', controller.getOrderById);
router.put('/:id', validate(updateOrderSchema), controller.updateOrder);
router.delete('/:id', controller.deleteOrder);

export default router;
