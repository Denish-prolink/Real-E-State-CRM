import * as repository from './site-visit.repository';
import type { ISiteVisit } from './site-visit.types';

export const createSiteVisitService = async (companyId: string, data: Partial<ISiteVisit>) => {
  return repository.createSiteVisit({ ...data, companyId: companyId as any });
};

export const getSiteVisitsService = async (companyId: string, filters: any = {}) => {
  return repository.findSiteVisitsByCompany(companyId, filters);
};

export const getSiteVisitByIdService = async (id: string, companyId: string) => {
  const visit = await repository.findSiteVisitById(id, companyId);
  if (!visit) {
    throw new Error('Site Visit not found');
  }
  return visit;
};

export const updateSiteVisitService = async (id: string, companyId: string, data: Partial<ISiteVisit>) => {
  const visit = await repository.updateSiteVisitById(id, companyId, data);
  if (!visit) {
    throw new Error('Site Visit not found');
  }
  return visit;
};

export const deleteSiteVisitService = async (id: string, companyId: string) => {
  const visit = await repository.deleteSiteVisitById(id, companyId);
  if (!visit) {
    throw new Error('Site Visit not found');
  }
  return visit;
};
