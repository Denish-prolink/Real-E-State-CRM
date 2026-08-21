import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './property.service';

export const createProperty = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);

  if (req.files && Array.isArray(req.files)) {
    const uploadedPhotos = req.files.map((file: any) => `/uploads/${file.filename}`);
    req.body.photos = req.body.photos
      ? Array.isArray(req.body.photos)
        ? [...req.body.photos, ...uploadedPhotos]
        : [req.body.photos, ...uploadedPhotos]
      : uploadedPhotos;
  }

  const property = await service.createPropertyService(agencyId, req.body);
  return successResponse(res, 'Property created successfully', property, 201);
};

export const getProperties = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const properties = await service.getPropertiesService(agencyId, req.query);
  return successResponse(res, 'Properties retrieved successfully', properties);
};

export const getPropertyById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const property = await service.getPropertyByIdService(req.params.id as string, agencyId);
  return successResponse(res, 'Property retrieved successfully', property);
};

export const updateProperty = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);

  if (req.files && Array.isArray(req.files)) {
    const uploadedPhotos = req.files.map((file: any) => `/uploads/${file.filename}`);
    req.body.photos = req.body.photos
      ? Array.isArray(req.body.photos)
        ? [...req.body.photos, ...uploadedPhotos]
        : [req.body.photos, ...uploadedPhotos]
      : uploadedPhotos;
  }

  const property = await service.updatePropertyService(
    req.params.id as string,
    agencyId,
    req.body,
  );
  return successResponse(res, 'Property updated successfully', property);
};

export const deleteProperty = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deletePropertyService(req.params.id as string, agencyId);
  return successResponse(res, 'Property deleted successfully');
};
