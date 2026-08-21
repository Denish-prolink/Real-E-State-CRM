import { ApiError } from '../../common/exceptions/ApiError';
import { hashPassword } from '../../common/helpers/password.helper';
import { User } from '../auth/auth.model';

import type { IAgency } from './agency.model';
import * as repository from './agency.repository';

export const createAgency = async (payload: Partial<IAgency> & { password?: string }) => {
  const agency = await repository.createAgency(payload);

  if (payload.email && payload.password) {
    const hashedPassword = await hashPassword(payload.password);
    await User.create({
      firstName: payload.name,
      lastName: 'Admin',
      email: payload.email,
      password: hashedPassword,
      role: 'agency',
      agencyId: agency._id,
    });
  }

  return agency;
};

export const getAgencies = async (query: Record<string, unknown>, page: number, limit: number) => {
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
    repository.findAgencies(filter, skip, limit),
    repository.countAgencies(filter),
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

export const getAgencyById = async (id: string) => {
  const agency = await repository.findAgencyById(id);
  if (!agency) {
    throw new ApiError('Agency not found', 404);
  }
  return agency;
};

export const updateAgency = async (
  id: string,
  payload: Partial<IAgency> & { password?: string },
) => {
  // Extract password before updating agency (since agency schema might not have it)
  const { password, ...agencyPayload } = payload;
  const agency = await repository.updateAgencyById(id, agencyPayload);
  if (!agency) {
    throw new ApiError('Agency not found', 404);
  }

  // Update the associated User document's firstName or password if needed
  const userUpdate: { firstName?: string; password?: string } = {};
  if (agencyPayload.name) {
    userUpdate.firstName = agencyPayload.name;
  }
  if (password) {
    userUpdate.password = await hashPassword(password);
  }

  if (Object.keys(userUpdate).length > 0) {
    await User.updateOne({ agencyId: id }, userUpdate);
  }

  return agency;
};

export const deleteAgency = async (id: string) => {
  const agency = await repository.deleteAgencyById(id);
  if (!agency) {
    throw new ApiError('Agency not found', 404);
  }
  return agency;
};
