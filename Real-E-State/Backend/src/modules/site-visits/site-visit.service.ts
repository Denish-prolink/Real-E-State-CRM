import * as repository from './site-visit.repository';
import type { ISiteVisit } from './site-visit.types';

export const createSiteVisitService = async (agencyId: string, data: Partial<ISiteVisit>) => {
  return repository.createSiteVisit({ ...data, agencyId: agencyId as any });
};

export const getSiteVisitsService = async (agencyId: string, filters: any = {}) => {
  return repository.findSiteVisitsByCompany(agencyId, filters);
};

export const getSiteVisitByIdService = async (id: string, agencyId: string) => {
  const visit = await repository.findSiteVisitById(id, agencyId);
  if (!visit) {
    throw new Error('Site Visit not found');
  }
  return visit;
};

export const updateSiteVisitService = async (
  id: string,
  agencyId: string,
  data: Partial<ISiteVisit>,
) => {
  const visit = await repository.updateSiteVisitById(id, agencyId, data);
  if (!visit) {
    throw new Error('Site Visit not found');
  }
  return visit;
};

export const deleteSiteVisitService = async (id: string, agencyId: string) => {
  const visit = await repository.deleteSiteVisitById(id, agencyId);
  if (!visit) {
    throw new Error('Site Visit not found');
  }
  return visit;
};
