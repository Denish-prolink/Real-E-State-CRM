import { Deal } from './deal.model';
import type { IDeal } from './deal.types';

export const createDeal = async (data: Partial<IDeal>) => {
  return Deal.create(data);
};

export const findDealsByCompany = async (agencyId: string | undefined, filters: any = {}) => {
  return Deal.find({ agencyId, ...filters })
    .populate('leadId', 'firstName lastName email phone')
    .populate('propertyId', 'title propertyId price area')
    .populate('agentId', 'firstName lastName email')
    .sort({ createdAt: -1 });
};

export const findDealById = async (id: string, agencyId: string | undefined) => {
  return Deal.findOne({ _id: id, agencyId })
    .populate('leadId', 'firstName lastName email phone')
    .populate('propertyId', 'title propertyId price area')
    .populate('agentId', 'firstName lastName email');
};

export const updateDealById = async (id: string, agencyId: string | undefined, data: Partial<IDeal>) => {
  return Deal.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteDealById = async (id: string, agencyId: string | undefined) => {
  return Deal.findOneAndDelete({ _id: id, agencyId });
};
