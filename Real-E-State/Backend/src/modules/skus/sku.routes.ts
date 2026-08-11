import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import {
  createSkuController,
  deleteSkuController,
  getSkuByIdController,
  getSkusController,
  updateSkuController,
} from './sku.controller';
import { addSkuSchema, updateSkuSchema } from './sku.validation';

const router = Router();

// GET /api/v1/skus
router.get('/', authenticate, getSkusController);

// GET /api/v1/skus/:id
router.get('/:id', authenticate, getSkuByIdController);

// POST /api/v1/skus
router.post('/', authenticate, validate(addSkuSchema), createSkuController);

// PUT /api/v1/skus/:id
router.put('/:id', authenticate, validate(updateSkuSchema), updateSkuController);

// DELETE /api/v1/skus/:id
router.delete('/:id', authenticate, deleteSkuController);

export default router;
