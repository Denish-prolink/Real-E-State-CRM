import * as dealRepository from './deal.repository';
import type { IDeal } from './deal.types';

export const createDealService = async (companyId: string, data: Partial<IDeal>) => {
  return dealRepository.createDeal({ ...data, companyId: companyId as any });
};

export const getDealsService = async (companyId: string, filters: any = {}) => {
  return dealRepository.findDealsByCompany(companyId, filters);
};

export const getDealByIdService = async (id: string, companyId: string) => {
  const deal = await dealRepository.findDealById(id, companyId);
  if (!deal) {
    throw new Error('Deal not found');
  }
  return deal;
};

export const updateDealService = async (id: string, companyId: string, data: Partial<IDeal>) => {
  const deal = await dealRepository.updateDealById(id, companyId, data);
  if (!deal) {
    throw new Error('Deal not found');
  }
  return deal;
};

export const deleteDealService = async (id: string, companyId: string) => {
  const deal = await dealRepository.deleteDealById(id, companyId);
  if (!deal) {
    throw new Error('Deal not found');
  }
  return deal;
};
