import { ApiError } from '../../common/exceptions/ApiError';

import type { ISeller } from './seller.types';
import * as repository from './seller.repository';

export const createSeller = async (data: Partial<ISeller> & { companyId: string }) => {
  return await repository.createSeller(data);
};

export const getSellers = async (
  companyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const [sellers, total] = await Promise.all([
    repository.getSellers(companyId, page, perPage, search),
    repository.countSellers(companyId, search),
  ]);

  return {
    sellers,
    total,
    page,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getSellerById = async (id: string, companyId: string) => {
  const seller = await repository.getSellerById(id, companyId);
  if (!seller) throw new ApiError('Seller not found', 404);
  return seller;
};

export const updateSeller = async (id: string, data: Partial<ISeller>, companyId: string) => {
  const seller = await repository.updateSeller(id, data, companyId);
  if (!seller) throw new ApiError('Seller not found', 404);
  return seller;
};

export const deleteSeller = async (id: string, companyId: string) => {
  const seller = await repository.deleteSeller(id, companyId);
  if (!seller) throw new ApiError('Seller not found', 404);
  return seller;
};
