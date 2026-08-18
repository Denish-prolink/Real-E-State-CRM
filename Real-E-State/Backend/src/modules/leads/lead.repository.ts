import { Lead } from './lead.model';
import type { ILead } from './lead.types';

export const createLead = async (data: Partial<ILead>) => {
  return Lead.create(data);
};

const buildFilter = (companyId: string, search?: string) => {
  return search
    ? {
        companyId,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : { companyId };
};

export const findLeadsByCompany = async (
  companyId: string,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
) => {
  const filter = buildFilter(companyId, search);
  const query = Lead.find(filter)
    .populate('assignedAgent', 'firstName lastName email')
    .sort({ createdAt: -1 });

  if (page === undefined || perPage === undefined) {
    return query;
  }

  const skip = (page - 1) * perPage;
  return query.skip(skip).limit(perPage);
};

export const countLeadsByCompany = async (companyId: string, search?: string) => {
  return Lead.countDocuments(buildFilter(companyId, search));
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
