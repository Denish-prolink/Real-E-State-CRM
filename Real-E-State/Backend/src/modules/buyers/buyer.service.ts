import { ApiError } from '../../common/exceptions/ApiError';

import type { IBuyer } from './buyer.types';
import * as repository from './buyer.repository';

export const createBuyer = async (data: Partial<IBuyer> & { agencyId: string | undefined }) => {
  return await repository.createBuyer(data);
};

export const getBuyers = async (
  agencyId: string | undefined,
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

export const getBuyerById = async (id: string, agencyId: string | undefined) => {
  const buyer = await repository.getBuyerById(id, agencyId);
  if (!buyer) throw new ApiError('Buyer not found', 404);
  return buyer;
};

export const updateBuyer = async (id: string, data: Partial<IBuyer>, agencyId: string | undefined) => {
  const buyer = await repository.updateBuyer(id, data, agencyId);
  if (!buyer) throw new ApiError('Buyer not found', 404);
  return buyer;
};

export const deleteBuyer = async (id: string, agencyId: string | undefined) => {
  const buyer = await repository.deleteBuyer(id, agencyId);
  if (!buyer) throw new ApiError('Buyer not found', 404);
  return buyer;
};
