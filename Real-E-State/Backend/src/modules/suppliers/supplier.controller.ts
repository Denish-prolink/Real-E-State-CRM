import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import {
  addSupplier,
  getSupplierById,
  getSuppliersList,
  removeSupplier,
  updateSupplierDetails,
} from './supplier.service';

export const createSupplierController = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const supplier = await addSupplier({ ...req.body, agencyId });
  return successResponse(res, 'Supplier created successfully', supplier, 201);
};

export const getSuppliersController = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const page = req.query.page ? Math.max(1, parseInt(req.query.page as string)) : undefined;
  const perPage = req.query.perPage
    ? Math.max(1, parseInt(req.query.perPage as string))
    : undefined;
  const search = (req.query.search as string) || undefined;

  const result = await getSuppliersList(agencyId, page, perPage, search);

  return successResponse(res, 'Suppliers fetched successfully', result);
};

export const getSupplierByIdController = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const supplier = await getSupplierById(req.params.id as string, agencyId);
  return successResponse(res, 'Supplier fetched successfully', supplier);
};

export const updateSupplierController = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const supplier = await updateSupplierDetails(req.params.id as string, req.body, agencyId);
  return successResponse(res, 'Supplier updated successfully', supplier);
};

export const deleteSupplierController = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await removeSupplier(req.params.id as string, agencyId);
  return successResponse(res, 'Supplier deleted successfully');
};
