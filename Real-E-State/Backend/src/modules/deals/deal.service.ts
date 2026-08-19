import * as dealRepository from './deal.repository';
import type { IDeal } from './deal.types';

export const createDealService = async (agencyId: string, data: Partial<IDeal>) => {
  return dealRepository.createDeal({ ...data, agencyId: agencyId as any });
};

export const getDealsService = async (agencyId: string, filters: any = {}) => {
  return dealRepository.findDealsByCompany(agencyId, filters);
};

export const getDealByIdService = async (id: string, agencyId: string) => {
  const deal = await dealRepository.findDealById(id, agencyId);
  if (!deal) {
    throw new Error('Deal not found');
  }
  return deal;
};

export const updateDealService = async (id: string, agencyId: string, data: Partial<IDeal>) => {
  const deal = await dealRepository.updateDealById(id, agencyId, data);
  if (!deal) {
    throw new Error('Deal not found');
  }
  return deal;
};

export const deleteDealService = async (id: string, agencyId: string) => {
  const deal = await dealRepository.deleteDealById(id, agencyId);
  if (!deal) {
    throw new Error('Deal not found');
  }
  return deal;
};
