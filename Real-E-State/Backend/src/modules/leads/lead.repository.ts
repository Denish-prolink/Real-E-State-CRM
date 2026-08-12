import { Lead } from './lead.model';
import type { ILead } from './lead.types';

export const createLead = async (data: Partial<ILead>) => {
  return Lead.create(data);
};

export const findLeadsByCompany = async (companyId: string, filters: any = {}) => {
  return Lead.find({ companyId, ...filters }).populate('assignedAgent', 'firstName lastName email').sort({ createdAt: -1 });
};

export const findLeadById = async (id: string, companyId: string) => {
  return Lead.findOne({ _id: id, companyId }).populate('assignedAgent', 'firstName lastName email');
};

export const updateLeadById = async (id: string, companyId: string, data: Partial<ILead>) => {
  return Lead.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
};

export const deleteLeadById = async (id: string, companyId: string) => {
  return Lead.findOneAndDelete({ _id: id, companyId });
};
