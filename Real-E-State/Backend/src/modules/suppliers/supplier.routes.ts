import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validation.middleware';

import {
  createSupplierController,
  deleteSupplierController,
  getSupplierByIdController,
  getSuppliersController,
  updateSupplierController,
} from './supplier.controller';
import { addSupplierSchema, updateSupplierSchema } from './supplier.validation';

const router = Router();

// GET /api/v1/suppliers
router.get('/', authenticate, getSuppliersController);

// GET /api/v1/suppliers/:id
router.get('/:id', authenticate, getSupplierByIdController);

// POST /api/v1/suppliers
router.post('/', authenticate, validate(addSupplierSchema), createSupplierController);

// PUT /api/v1/suppliers/:id
router.put('/:id', authenticate, validate(updateSupplierSchema), updateSupplierController);

// DELETE /api/v1/suppliers/:id
router.delete('/:id', authenticate, deleteSupplierController);

export default router;
