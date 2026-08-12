import { Deal } from './deal.model';
import type { IDeal } from './deal.types';

export const createDeal = async (data: Partial<IDeal>) => {
  return Deal.create(data);
};

export const findDealsByCompany = async (companyId: string, filters: any = {}) => {
  return Deal.find({ companyId, ...filters })
    .populate('leadId', 'firstName lastName email phone')
    .populate('propertyId', 'title propertyId price area')
    .populate('agentId', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

export const findDealById = async (id: string, companyId: string) => {
  return Deal.findOne({ _id: id, companyId })
    .populate('leadId', 'firstName lastName email phone')
    .populate('propertyId', 'title propertyId price area')
    .populate('agentId', 'firstName lastName email');
};

export const updateDealById = async (id: string, companyId: string, data: Partial<IDeal>) => {
  return Deal.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
};

export const deleteDealById = async (id: string, companyId: string) => {
  return Deal.findOneAndDelete({ _id: id, companyId });
};
