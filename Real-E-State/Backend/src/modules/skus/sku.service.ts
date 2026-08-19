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

export const addSku = async (payload: ISkuPayload & { agencyId: string }) => {
  const existingSku = await findSkuByCode(payload.skuCode, payload.agencyId);
  if (existingSku) {
    throw new ApiError('SKU code already exists', 409);
  }
  return createSku(payload);
};

export const getSkusList = async (
  agencyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const [skus, total] = await Promise.all([
    findSkus(agencyId, page, perPage, search),
    countSkus(agencyId, search),
  ]);
  return {
    skus,
    total,
    page,
    perPage,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getSkuById = async (id: string, agencyId: string) => {
  const sku = await findSkuById(id, agencyId);
  if (!sku) {
    throw new ApiError('SKU not found', 404);
  }
  return sku;
};

export const updateSkuDetails = async (
  id: string,
  payload: Partial<ISkuPayload>,
  agencyId: string,
) => {
  const sku = await findSkuById(id, agencyId);
  if (!sku) {
    throw new ApiError('SKU not found', 404);
  }

  if (payload.skuCode && payload.skuCode !== sku.skuCode) {
    const existingSku = await findSkuByCode(payload.skuCode, agencyId);
    if (existingSku) {
      throw new ApiError('SKU code already exists', 409);
    }
  }

  return updateSku(id, payload, agencyId);
};

export const removeSku = async (id: string, agencyId: string) => {
  const sku = await findSkuById(id, agencyId);
  if (!sku) {
    throw new ApiError('SKU not found', 404);
  }
  return deleteSku(id, agencyId);
};
