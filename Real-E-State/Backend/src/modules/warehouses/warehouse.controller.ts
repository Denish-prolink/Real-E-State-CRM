import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './warehouse.service';

export const createWarehouse = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const warehouse = await service.createWarehouse({ ...req.body, agencyId });
  return successResponse(res, 'Warehouse created successfully', warehouse, 201);
};

export const getWarehouses = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const search = req.query.search as string | undefined;
  const warehouses = await service.getWarehouses(agencyId, search);
  return successResponse(res, 'Warehouses retrieved successfully', warehouses);
};

export const getWarehouseById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const warehouse = await service.getWarehouseById(req.params.id as string, agencyId);
  return successResponse(res, 'Warehouse retrieved successfully', warehouse);
};

export const updateWarehouse = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const warehouse = await service.updateWarehouse(req.params.id as string, req.body, agencyId);
  return successResponse(res, 'Warehouse updated successfully', warehouse);
};

export const deleteWarehouse = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deleteWarehouse(req.params.id as string, agencyId);
  return successResponse(res, 'Warehouse deleted successfully');
};
