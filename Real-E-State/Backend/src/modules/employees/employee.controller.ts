import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './employee.service';

export const createEmployee = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const employee = await service.createEmployee({ ...req.body, agencyId });
  return successResponse(res, 'Employee created successfully', employee, 201);
};

export const getEmployees = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const search = (req.query.search as string) || undefined;
  const employees = await service.getEmployees(agencyId, search);
  return successResponse(res, 'Employees retrieved successfully', employees);
};

export const getEmployeeById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const employee = await service.getEmployeeById(req.params.id as string, agencyId);
  return successResponse(res, 'Employee retrieved successfully', employee);
};

export const updateEmployee = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const employee = await service.updateEmployee(req.params.id as string, req.body, agencyId);
  return successResponse(res, 'Employee updated successfully', employee);
};

export const deleteEmployee = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deleteEmployee(req.params.id as string, agencyId);
  return successResponse(res, 'Employee deleted successfully');
};
