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

export const addProduct = async (payload: IProductPayload & { agencyId: string | undefined }) => {
  // Check barcode uniqueness if provided
  if (payload.barcode) {
    const existingProduct = await findProductByBarcode(payload.barcode, payload.agencyId);
    if (existingProduct) {
      throw new ApiError('Product with this barcode already exists', 409);
    }
  }

  const product = await createProduct(payload);
  return product;
};

export const getProductsList = async (
  agencyId: string | undefined,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const [products, total] = await Promise.all([
    findProducts(agencyId, page, perPage, search),
    countProducts(agencyId, search),
  ]);
  return {
    products,
    total,
    page,
    perPage,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getProductById = async (id: string, agencyId: string | undefined) => {
  const product = await findProductById(id, agencyId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  return product;
};

export const updateProductDetails = async (
  id: string,
  payload: Partial<IProductPayload>,
  agencyId: string | undefined,
) => {
  const product = await findProductById(id, agencyId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  if (payload.barcode) {
    const existingProduct = await findProductByBarcode(payload.barcode, agencyId);
    if (existingProduct && existingProduct._id.toString() !== id) {
      throw new ApiError('Product with this barcode already exists', 409);
    }
  }

  const updatedProduct = await updateProduct(id, payload, agencyId);
  return updatedProduct;
};

export const removeProduct = async (id: string, agencyId: string | undefined) => {
  const product = await findProductById(id, agencyId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  const result = await deleteProduct(id, agencyId);
  return result;
};
