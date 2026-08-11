import { Company, type ICompany } from './company.model';

export const createCompany = async (payload: Partial<ICompany>) => {
  return Company.create(payload);
};

export const findCompanies = async (
  query: Record<string, unknown>,
  skip: number,
  limit: number,
) => {
  return Company.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
};

export const countCompanies = async (query: Record<string, unknown>) => {
  return Company.countDocuments(query);
};

export const findCompanyById = async (id: string) => {
  return Company.findById(id);
};

export const updateCompanyById = async (id: string, payload: Partial<ICompany>) => {
  return Company.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteCompanyById = async (id: string) => {
  return Company.findByIdAndDelete(id);
};
