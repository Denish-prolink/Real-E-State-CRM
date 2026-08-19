import { ApiError } from '../../common/exceptions/ApiError';

import {
  countProducts,
  createProduct,
  deleteProduct,
  findProductByBarcode,
  findProductById,
  findProducts,
  updateProduct,
} from './product.repository';
import type { IProductPayload } from './product.types';

export const addProduct = async (payload: IProductPayload & { companyId: string }) => {
  // Check barcode uniqueness if provided
  if (payload.barcode) {
    const existingProduct = await findProductByBarcode(payload.barcode, payload.companyId);
    if (existingProduct) {
      throw new ApiError('Product with this barcode already exists', 409);
    }
  }

  const product = await createProduct(payload);
  return product;
};

export const getProductsList = async (
  companyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const [products, total] = await Promise.all([
    findProducts(companyId, page, perPage, search),
    countProducts(companyId, search),
  ]);
  return {
    products,
    total,
    page,
    perPage,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getProductById = async (id: string, companyId: string) => {
  const product = await findProductById(id, companyId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  return product;
};

export const updateProductDetails = async (
  id: string,
  payload: Partial<IProductPayload>,
  companyId: string,
) => {
  const product = await findProductById(id, companyId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  if (payload.barcode) {
    const existingProduct = await findProductByBarcode(payload.barcode, companyId);
    if (existingProduct && existingProduct._id.toString() !== id) {
      throw new ApiError('Product with this barcode already exists', 409);
    }
  }

  const updatedProduct = await updateProduct(id, payload, companyId);
  return updatedProduct;
};

export const removeProduct = async (id: string, companyId: string) => {
  const product = await findProductById(id, companyId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  const result = await deleteProduct(id, companyId);
  return result;
};
