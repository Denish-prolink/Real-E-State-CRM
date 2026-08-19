import { ApiError } from '../../common/exceptions/ApiError';

import type { IEmployee } from './employee.model';
import * as repository from './employee.repository';

export const createEmployee = async (data: Partial<IEmployee> & { agencyId: string | undefined }) => {
  if (data.employeeCode) {
    const existing = await repository.getEmployeeByCode(data.employeeCode, data.agencyId);
    if (existing) {
      throw new ApiError('Employee with this code already exists', 409);
    }
  }
  return await repository.createEmployee(data);
};

export const getEmployees = async (agencyId: string | undefined, search?: string) => {
  return await repository.getEmployees(agencyId, search);
};

export const getEmployeeById = async (id: string, agencyId: string | undefined) => {
  const employee = await repository.getEmployeeById(id, agencyId);
  if (!employee) {
    throw new ApiError('Employee not found', 404);
  }
  return employee;
};

export const updateEmployee = async (id: string, data: Partial<IEmployee>, agencyId: string | undefined) => {
  if (data.employeeCode) {
    const existing = await repository.getEmployeeByCode(data.employeeCode, agencyId);
    if (existing && existing._id.toString() !== id) {
      throw new ApiError('Employee with this code already exists', 409);
    }
  }
  const employee = await repository.updateEmployee(id, data, agencyId);
  if (!employee) {
    throw new ApiError('Employee not found', 404);
  }
  return employee;
};

export const deleteEmployee = async (id: string, agencyId: string | undefined) => {
  const employee = await repository.deleteEmployee(id, agencyId);
  if (!employee) {
    throw new ApiError('Employee not found', 404);
  }
  return employee;
};
