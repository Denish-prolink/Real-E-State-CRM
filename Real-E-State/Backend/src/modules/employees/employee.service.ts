import { ApiError } from '../../common/exceptions/ApiError';

import type { IEmployee } from './employee.model';
import * as repository from './employee.repository';

export const createEmployee = async (data: Partial<IEmployee> & { companyId: string }) => {
  if (data.employeeCode) {
    const existing = await repository.getEmployeeByCode(data.employeeCode, data.companyId);
    if (existing) {
      throw new ApiError('Employee with this code already exists', 409);
    }
  }
  return await repository.createEmployee(data);
};

export const getEmployees = async (companyId: string, search?: string) => {
  return await repository.getEmployees(companyId, search);
};

export const getEmployeeById = async (id: string, companyId: string) => {
  const employee = await repository.getEmployeeById(id, companyId);
  if (!employee) {
    throw new ApiError('Employee not found', 404);
  }
  return employee;
};

export const updateEmployee = async (id: string, data: Partial<IEmployee>, companyId: string) => {
  if (data.employeeCode) {
    const existing = await repository.getEmployeeByCode(data.employeeCode, companyId);
    if (existing && existing._id.toString() !== id) {
      throw new ApiError('Employee with this code already exists', 409);
    }
  }
  const employee = await repository.updateEmployee(id, data, companyId);
  if (!employee) {
    throw new ApiError('Employee not found', 404);
  }
  return employee;
};

export const deleteEmployee = async (id: string, companyId: string) => {
  const employee = await repository.deleteEmployee(id, companyId);
  if (!employee) {
    throw new ApiError('Employee not found', 404);
  }
  return employee;
};
