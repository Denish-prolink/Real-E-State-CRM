import * as leadRepository from './lead.repository';
import type { ILead } from './lead.types';

export const createLeadService = async (agencyId: string | undefined, data: Partial<ILead>) => {
  return leadRepository.createLead({ ...data, agencyId: agencyId as any });
};

export const getLeadsService = async (
  agencyId: string | undefined,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
) => {
  const [leads, total] = await Promise.all([
    leadRepository.findLeadsByCompany(agencyId, page, perPage, search),
    leadRepository.countLeadsByCompany(agencyId, search),
  ]);

  return {
    leads,
    total,
    page,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getLeadByIdService = async (id: string, agencyId: string | undefined) => {
  const lead = await leadRepository.findLeadById(id, agencyId);
  if (!lead) {
    throw new Error('Lead not found');
  }
  return lead;
};

export const updateLeadService = async (id: string, agencyId: string | undefined, data: Partial<ILead>) => {
  const lead = await leadRepository.updateLeadById(id, agencyId, data);
  if (!lead) {
    throw new Error('Lead not found');
  }
  return lead;
};

export const deleteLeadService = async (id: string, agencyId: string | undefined) => {
  const lead = await leadRepository.deleteLeadById(id, agencyId);
  if (!lead) {
    throw new Error('Lead not found');
  }
  return lead;
};
