import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from './category.controller';
import { addCategorySchema, updateCategorySchema } from './category.validation';

const router = Router();

// GET /api/v1/categories
router.get('/', authenticate, getCategoriesController);

// GET /api/v1/categories/:id
router.get('/:id', authenticate, getCategoryByIdController);

// POST /api/v1/categories
router.post('/', authenticate, validate(addCategorySchema), createCategoryController);

// PUT /api/v1/categories/:id
router.put('/:id', authenticate, validate(updateCategorySchema), updateCategoryController);

// DELETE /api/v1/categories/:id
router.delete('/:id', authenticate, deleteCategoryController);

export default router;
