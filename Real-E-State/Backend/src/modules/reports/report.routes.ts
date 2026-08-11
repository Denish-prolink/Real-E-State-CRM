import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';

import {
  getBuyReportController,
  getProductsReportController,
  getProfitLossController,
  getSellReportController,
} from './report.controller';

const router = Router();

// GET /api/v1/reports/profit-loss
router.get('/profit-loss', authenticate, getProfitLossController);

// GET /api/v1/reports/products
router.get('/products', authenticate, getProductsReportController);

// GET /api/v1/reports/sell
router.get('/sell', authenticate, getSellReportController);

// GET /api/v1/reports/buy
router.get('/buy', authenticate, getBuyReportController);

export default router;
