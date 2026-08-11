import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getCompanyId } from '../../middlewares/auth.middleware';

import * as service from './warehouse.service';

export const createWarehouse = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const warehouse = await service.createWarehouse({ ...req.body, companyId });
  return successResponse(res, 'Warehouse created successfully', warehouse, 201);
};

export const getWarehouses = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const search = req.query.search as string | undefined;
  const warehouses = await service.getWarehouses(companyId, search);
  return successResponse(res, 'Warehouses retrieved successfully', warehouses);
};

export const getWarehouseById = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const warehouse = await service.getWarehouseById(req.params.id as string, companyId);
  return successResponse(res, 'Warehouse retrieved successfully', warehouse);
};

export const updateWarehouse = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const warehouse = await service.updateWarehouse(req.params.id as string, req.body, companyId);
  return successResponse(res, 'Warehouse updated successfully', warehouse);
};

export const deleteWarehouse = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  await service.deleteWarehouse(req.params.id as string, companyId);
  return successResponse(res, 'Warehouse deleted successfully');
};
