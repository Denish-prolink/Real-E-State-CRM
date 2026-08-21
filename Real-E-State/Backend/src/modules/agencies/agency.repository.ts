import { Agency, type IAgency } from './agency.model';

export const createAgency = async (payload: Partial<IAgency>) => {
  return Agency.create(payload);
};

export const findAgencies = async (
  query: Record<string, unknown>,
  skip: number,
  limit: number,
) => {
  return Agency.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const countAgencies = async (query: Record<string, unknown>) => {
  return Agency.countDocuments(query);
};

export const findAgencyById = async (id: string) => {
  return Agency.findById(id);
};

export const updateAgencyById = async (id: string, payload: Partial<IAgency>) => {
  return Agency.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteAgencyById = async (id: string) => {
  return Agency.findByIdAndDelete(id);
};
