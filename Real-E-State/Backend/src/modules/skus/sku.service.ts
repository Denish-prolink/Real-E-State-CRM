import { ApiError } from '../../common/exceptions/ApiError';

import {
  countSkus,
  createSku,
  deleteSku,
  findSkuByCode,
  findSkuById,
  findSkus,
  updateSku,
} from './sku.repository';
import type { ISkuPayload } from './sku.types';

export const addSku = async (payload: ISkuPayload & { companyId: string }) => {
  const existingSku = await findSkuByCode(payload.skuCode, payload.companyId);
  if (existingSku) {
    throw new ApiError('SKU code already exists', 409);
  }
  return createSku(payload);
};

export const getSkusList = async (
  companyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const [skus, total] = await Promise.all([
    findSkus(companyId, page, perPage, search),
    countSkus(companyId, search),
  ]);
  return {
    skus,
    total,
    page,
    perPage,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getSkuById = async (id: string, companyId: string) => {
  const sku = await findSkuById(id, companyId);
  if (!sku) {
    throw new ApiError('SKU not found', 404);
  }
  return sku;
};

export const updateSkuDetails = async (
  id: string,
  payload: Partial<ISkuPayload>,
  companyId: string,
) => {
  const sku = await findSkuById(id, companyId);
  if (!sku) {
    throw new ApiError('SKU not found', 404);
  }

  if (payload.skuCode && payload.skuCode !== sku.skuCode) {
    const existingSku = await findSkuByCode(payload.skuCode, companyId);
    if (existingSku) {
      throw new ApiError('SKU code already exists', 409);
    }
  }

  return updateSku(id, payload, companyId);
};

export const removeSku = async (id: string, companyId: string) => {
  const sku = await findSkuById(id, companyId);
  if (!sku) {
    throw new ApiError('SKU not found', 404);
  }
  return deleteSku(id, companyId);
};
