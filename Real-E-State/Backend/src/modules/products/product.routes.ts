import { type NextFunction, type Request, type Response, Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { validate } from '../../middlewares/validation.middleware';

import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  updateProductController,
  uploadProductImageController,
} from './product.controller';
import { addProductSchema, updateProductSchema } from './product.validation';

const router = Router();

const preprocessImages = (req: Request, res: Response, next: NextFunction) => {
  let images: string[] = [];
  if (req.body.images) {
    if (Array.isArray(req.body.images)) {
      images = req.body.images;
    } else if (typeof req.body.images === 'string') {
      try {
        const parsed = JSON.parse(req.body.images);
        images = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        images = [req.body.images];
      }
    }
  }

  if (req.files && Array.isArray(req.files)) {
    const newImageUrls = (req.files as Express.Multer.File[]).map(
      (file) => `/uploads/${file.filename}`,
    );
    images = [...images, ...newImageUrls];
  }

  req.body.images = images;
  next();
};

// GET /api/v1/products
router.get('/', authenticate, getProductsController);

// GET /api/v1/products/:id
router.get('/:id', authenticate, getProductByIdController);

// POST /api/v1/products/upload
router.post('/upload', authenticate, upload.single('image'), uploadProductImageController);

// POST /api/v1/products
router.post(
  '/',
  authenticate,
  upload.array('images', 5),
  preprocessImages,
  validate(addProductSchema),
  createProductController,
);

// PUT /api/v1/products/:id
router.put(
  '/:id',
  authenticate,
  upload.array('images', 5),
  preprocessImages,
  validate(updateProductSchema),
  updateProductController,
);

// DELETE /api/v1/products/:id
router.delete('/:id', authenticate, deleteProductController);

export default router;
