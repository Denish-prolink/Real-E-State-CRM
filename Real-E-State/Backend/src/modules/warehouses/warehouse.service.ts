import { ApiError } from '../../common/exceptions/ApiError';

import type { IWarehouse } from './warehouse.model';
import * as repository from './warehouse.repository';

export const createWarehouse = async (data: Partial<IWarehouse> & { companyId: string }) => {
  if (data.warehouseCode) {
    const existing = await repository.getWarehouseByCode(data.warehouseCode, data.companyId);
    if (existing) {
      throw new ApiError('Warehouse with this code already exists', 409);
    }
  }
  return await repository.createWarehouse(data);
};

export const getWarehouses = async (companyId: string, search?: string) => {
  return await repository.getWarehouses(companyId, search);
};

export const getWarehouseById = async (id: string, companyId: string) => {
  const warehouse = await repository.getWarehouseById(id, companyId);
  if (!warehouse) {
    throw new ApiError('Warehouse not found', 404);
  }
  return warehouse;
};

export const updateWarehouse = async (id: string, data: Partial<IWarehouse>, companyId: string) => {
  if (data.warehouseCode) {
    const existing = await repository.getWarehouseByCode(data.warehouseCode, companyId);
    if (existing && existing._id.toString() !== id) {
      throw new ApiError('Warehouse with this code already exists', 409);
    }
  }
  const warehouse = await repository.updateWarehouse(id, data, companyId);
  if (!warehouse) {
    throw new ApiError('Warehouse not found', 404);
  }
  return warehouse;
};

export const deleteWarehouse = async (id: string, companyId: string) => {
  const warehouse = await repository.deleteWarehouse(id, companyId);
  if (!warehouse) {
    throw new ApiError('Warehouse not found', 404);
  }
  return warehouse;
};
