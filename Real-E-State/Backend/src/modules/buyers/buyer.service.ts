import { ApiError } from '../../common/exceptions/ApiError';

import * as repository from './buyer.repository';
import type { IBuyer } from './buyer.types';

export const createBuyer = async (data: Partial<IBuyer> & { agencyId: string }) => {
  return await repository.createBuyer(data);
};

export const getBuyers = async (
  agencyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const [buyers, total] = await Promise.all([
    repository.getBuyers(agencyId, page, perPage, search),
    repository.countBuyers(agencyId, search),
  ]);

  return {
    buyers,
    total,
    page,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getBuyerById = async (id: string, agencyId: string) => {
  const buyer = await repository.getBuyerById(id, agencyId);
  if (!buyer) {
    throw new ApiError('Buyer not found', 404);
  }
  return buyer;
};

export const updateBuyer = async (id: string, data: Partial<IBuyer>, agencyId: string) => {
  const buyer = await repository.updateBuyer(id, data, agencyId);
  if (!buyer) {
    throw new ApiError('Buyer not found', 404);
  }
  return buyer;
};

export const deleteBuyer = async (id: string, agencyId: string) => {
  const buyer = await repository.deleteBuyer(id, agencyId);
  if (!buyer) {
    throw new ApiError('Buyer not found', 404);
  }
  return buyer;
};
