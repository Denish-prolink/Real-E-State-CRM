import { ApiError } from '../../common/exceptions/ApiError';

import * as repository from './seller.repository';
import type { ISeller } from './seller.types';

export const createSeller = async (data: Partial<ISeller> & { agencyId: string }) => {
  return await repository.createSeller(data);
};

export const getSellers = async (
  agencyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const [sellers, total] = await Promise.all([
    repository.getSellers(agencyId, page, perPage, search),
    repository.countSellers(agencyId, search),
  ]);

  return {
    sellers,
    total,
    page,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getSellerById = async (id: string, agencyId: string) => {
  const seller = await repository.getSellerById(id, agencyId);
  if (!seller) {
    throw new ApiError('Seller not found', 404);
  }
  return seller;
};

export const updateSeller = async (id: string, data: Partial<ISeller>, agencyId: string) => {
  const seller = await repository.updateSeller(id, data, agencyId);
  if (!seller) {
    throw new ApiError('Seller not found', 404);
  }
  return seller;
};

export const deleteSeller = async (id: string, agencyId: string) => {
  const seller = await repository.deleteSeller(id, agencyId);
  if (!seller) {
    throw new ApiError('Seller not found', 404);
  }
  return seller;
};
