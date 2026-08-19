import { ApiError } from '../../common/exceptions/ApiError';
import { hashPassword } from '../../common/helpers/password.helper';
import { User } from '../auth/auth.model';

import type { ICompany } from './company.model';
import * as repository from './company.repository';

export const createCompany = async (payload: Partial<ICompany> & { password?: string }) => {
  const company = await repository.createCompany(payload);

  if (payload.email && payload.password) {
    const hashedPassword = await hashPassword(payload.password);
    await User.create({
      firstName: payload.name,
      lastName: 'Admin',
      email: payload.email,
      password: hashedPassword,
      role: 'AGENCY',
      agencyId: company._id,
    });
  }

  return company;
};

export const getCompanies = async (query: Record<string, unknown>, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { gst: { $regex: query.search, $options: 'i' } },
      { pan: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [data, total] = await Promise.all([
    repository.findCompanies(filter, skip, limit),
    repository.countCompanies(filter),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCompanyById = async (id: string) => {
  const company = await repository.findCompanyById(id);
  if (!company) {
    throw new ApiError('Company not found', 404);
  }
  return company;
};

export const updateCompany = async (
  id: string,
  payload: Partial<ICompany> & { password?: string },
) => {
  // Extract password before updating company (since company schema might not have it)
  const { password, ...companyPayload } = payload;
  const company = await repository.updateCompanyById(id, companyPayload);
  if (!company) {
    throw new ApiError('Company not found', 404);
  }

  // Update the associated User document's firstName or password if needed
  const userUpdate: { firstName?: string; password?: string } = {};
  if (companyPayload.name) {
    userUpdate.firstName = companyPayload.name;
  }
  if (password) {
    userUpdate.password = await hashPassword(password);
  }

  if (Object.keys(userUpdate).length > 0) {
    await User.updateOne({ agencyId: id }, userUpdate);
  }

  return company;
};

export const deleteCompany = async (id: string) => {
  const company = await repository.deleteCompanyById(id);
  if (!company) {
    throw new ApiError('Company not found', 404);
  }
  return company;
};
