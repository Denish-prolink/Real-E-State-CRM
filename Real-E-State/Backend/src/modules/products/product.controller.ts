import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getCompanyId } from '../../middlewares/auth.middleware';

import {
  addProduct,
  getProductById,
  getProductsList,
  removeProduct,
  updateProductDetails,
} from './product.service';

export const createProductController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const product = await addProduct({ ...req.body, companyId });

  return successResponse(res, 'Product created successfully', product, 201);
};

export const getProductsController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const page = req.query.page ? Math.max(1, parseInt(req.query.page as string)) : undefined;
  const perPage = req.query.perPage
    ? Math.max(1, parseInt(req.query.perPage as string))
    : undefined;
  const search = (req.query.search as string) || undefined;

  const result = await getProductsList(companyId, page, perPage, search);

  return successResponse(res, 'Products fetched successfully', result);
};

export const getProductByIdController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const product = await getProductById(req.params.id as string, companyId);

  return successResponse(res, 'Product fetched successfully', product);
};

export const updateProductController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const product = await updateProductDetails(req.params.id as string, req.body, companyId);

  return successResponse(res, 'Product updated successfully', product);
};

export const deleteProductController = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  await removeProduct(req.params.id as string, companyId);

  return successResponse(res, 'Product deleted successfully');
};

export const uploadProductImageController = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }

  // Return the public URL for the image
  const imageUrl = `/uploads/${req.file.filename}`;
  return successResponse(res, 'Image uploaded successfully', { url: imageUrl });
};
