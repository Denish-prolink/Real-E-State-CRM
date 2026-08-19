import { ApiError } from '../../common/exceptions/ApiError';

import {
  countSuppliers,
  createSupplier,
  deleteSupplier,
  findSupplierByCode,
  findSupplierById,
  findSuppliers,
  updateSupplier,
} from './supplier.repository';
import type { ISupplierPayload } from './supplier.types';

export const addSupplier = async (payload: ISupplierPayload & { agencyId: string }) => {
  const existingSupplier = await findSupplierByCode(payload.supplierCode, payload.agencyId);
  if (existingSupplier) {
    throw new ApiError('Supplier with this code already exists', 409);
  }

  return createSupplier(payload);
};

export const getSuppliersList = async (
  agencyId: string,
  page?: number,
  perPage?: number,
  search?: string,
) => {
  const [suppliers, total] = await Promise.all([
    findSuppliers(agencyId, page, perPage, search),
    countSuppliers(agencyId, search),
  ]);
  return {
    suppliers,
    total,
    page,
    perPage,
    totalPages: perPage ? Math.ceil(total / perPage) : 1,
  };
};

export const getSupplierById = async (id: string, agencyId: string) => {
  const supplier = await findSupplierById(id, agencyId);
  if (!supplier) {
    throw new ApiError('Supplier not found', 404);
  }
  return supplier;
};

export const updateSupplierDetails = async (
  id: string,
  payload: Partial<ISupplierPayload>,
  agencyId: string,
) => {
  const supplier = await findSupplierById(id, agencyId);
  if (!supplier) {
    throw new ApiError('Supplier not found', 404);
  }

  if (payload.supplierCode) {
    const existingSupplier = await findSupplierByCode(payload.supplierCode, agencyId);
    if (existingSupplier && existingSupplier._id.toString() !== id) {
      throw new ApiError('Supplier with this code already exists', 409);
    }
  }

  return updateSupplier(id, payload, agencyId);
};

export const removeSupplier = async (id: string, agencyId: string) => {
  const supplier = await findSupplierById(id, agencyId);
  if (!supplier) {
    throw new ApiError('Supplier not found', 404);
  }
  return deleteSupplier(id, agencyId);
};
