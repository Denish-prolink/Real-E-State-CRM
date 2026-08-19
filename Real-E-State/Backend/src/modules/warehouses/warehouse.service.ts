import { ApiError } from '../../common/exceptions/ApiError';

import type { IWarehouse } from './warehouse.model';
import * as repository from './warehouse.repository';

export const createWarehouse = async (data: Partial<IWarehouse> & { agencyId: string }) => {
  if (data.warehouseCode) {
    const existing = await repository.getWarehouseByCode(data.warehouseCode, data.agencyId);
    if (existing) {
      throw new ApiError('Warehouse with this code already exists', 409);
    }
  }
  return await repository.createWarehouse(data);
};

export const getWarehouses = async (agencyId: string, search?: string) => {
  return await repository.getWarehouses(agencyId, search);
};

export const getWarehouseById = async (id: string, agencyId: string) => {
  const warehouse = await repository.getWarehouseById(id, agencyId);
  if (!warehouse) {
    throw new ApiError('Warehouse not found', 404);
  }
  return warehouse;
};

export const updateWarehouse = async (id: string, data: Partial<IWarehouse>, agencyId: string) => {
  if (data.warehouseCode) {
    const existing = await repository.getWarehouseByCode(data.warehouseCode, agencyId);
    if (existing && existing._id.toString() !== id) {
      throw new ApiError('Warehouse with this code already exists', 409);
    }
  }
  const warehouse = await repository.updateWarehouse(id, data, agencyId);
  if (!warehouse) {
    throw new ApiError('Warehouse not found', 404);
  }
  return warehouse;
};

export const deleteWarehouse = async (id: string, agencyId: string) => {
  const warehouse = await repository.deleteWarehouse(id, agencyId);
  if (!warehouse) {
    throw new ApiError('Warehouse not found', 404);
  }
  return warehouse;
};
