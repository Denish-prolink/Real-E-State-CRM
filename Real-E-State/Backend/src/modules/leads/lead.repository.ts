import { Lead } from './lead.model';
import type { ILead } from './lead.types';

export const createLead = async (data: Partial<ILead>) => {
  return Lead.create(data);
};

const buildFilter = (agencyId: string | undefined, search?: string) => {
  return search
    ? {
        agencyId,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : { agencyId };
};

export const findLeadsByCompany = async (
  agencyId: string | undefined,
  page: number | undefined,
  perPage: number | undefined,
  search?: string,
) => {
  const filter = buildFilter(agencyId, search);
  const query = Lead.find(filter)
    .populate('assignedAgent', 'firstName lastName email')
    .sort({ createdAt: -1 });

  if (page === undefined || perPage === undefined) {
    return query;
  }

  const skip = (page - 1) * perPage;
  return query.skip(skip).limit(perPage);
};

export const countLeadsByCompany = async (agencyId: string | undefined, search?: string) => {
  return Lead.countDocuments(buildFilter(agencyId, search));
};

export const findLeadById = async (id: string, agencyId: string | undefined) => {
  return Lead.findOne({ _id: id, agencyId }).populate('assignedAgent', 'firstName lastName email');
};

export const updateLeadById = async (id: string, agencyId: string | undefined, data: Partial<ILead>) => {
  return Lead.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteLeadById = async (id: string, agencyId: string | undefined) => {
  return Lead.findOneAndDelete({ _id: id, agencyId });
};
