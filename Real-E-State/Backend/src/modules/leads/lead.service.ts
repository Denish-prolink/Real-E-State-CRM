import * as leadRepository from './lead.repository';
import type { ILead } from './lead.types';

export const createLeadService = async (companyId: string, data: Partial<ILead>) => {
  return leadRepository.createLead({ ...data, companyId: companyId as any });
};

export const getLeadsService = async (companyId: string, filters: any = {}) => {
  return leadRepository.findLeadsByCompany(companyId, filters);
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
