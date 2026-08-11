import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';

import { getLowStockNotification, markAsRead, markAllAsRead } from './notification.controller';

const router = Router();

router.get('/low-stock', authenticate, getLowStockNotification);
router.put('/read-all', authenticate, markAllAsRead);
router.put('/read/:id', authenticate, markAsRead);

export default router;
