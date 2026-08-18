import * as leadRepository from './lead.repository';
import type { ILead } from './lead.types';

export const createLeadService = async (companyId: string, data: Partial<ILead>) => {
  return leadRepository.createLead({ ...data, companyId: companyId as any });
};

export const getLeadsService = async (
  companyId: string,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
) => {
  const [leads, total] = await Promise.all([
    leadRepository.findLeadsByCompany(companyId, page, perPage, search),
    leadRepository.countLeadsByCompany(companyId, search),
  ]);

  return {
    leads,
    total,
    page,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getLeadByIdService = async (id: string, companyId: string) => {
  const lead = await leadRepository.findLeadById(id, companyId);
  if (!lead) {
    throw new Error('Lead not found');
  }
  return lead;
};

export const updateLeadService = async (id: string, companyId: string, data: Partial<ILead>) => {
  const lead = await leadRepository.updateLeadById(id, companyId, data);
  if (!lead) {
    throw new Error('Lead not found');
  }
  return lead;
};

export const deleteLeadService = async (id: string, companyId: string) => {
  const lead = await leadRepository.deleteLeadById(id, companyId);
  if (!lead) {
    throw new Error('Lead not found');
  }
  return lead;
};
