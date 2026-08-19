import { SiteVisit } from './site-visit.model';
import type { ISiteVisit } from './site-visit.types';

export const createSiteVisit = async (data: Partial<ISiteVisit>) => {
  return SiteVisit.create(data);
};

export const findSiteVisitsByCompany = async (agencyId: string | undefined, filters: any = {}) => {
  return SiteVisit.find({ agencyId, ...filters })
    .populate('leadId', 'firstName lastName email phone')
    .populate('propertyId', 'title propertyId price area')
    .populate('agentId', 'firstName lastName email')
    .sort({ visitDate: -1 });
};

export const findSiteVisitById = async (id: string, agencyId: string | undefined) => {
  return SiteVisit.findOne({ _id: id, agencyId })
    .populate('leadId', 'firstName lastName email phone')
    .populate('propertyId', 'title propertyId price area')
    .populate('agentId', 'firstName lastName email');
};

export const updateSiteVisitById = async (id: string, agencyId: string | undefined, data: Partial<ISiteVisit>) => {
  return SiteVisit.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteSiteVisitById = async (id: string, agencyId: string | undefined) => {
  return SiteVisit.findOneAndDelete({ _id: id, agencyId });
};
