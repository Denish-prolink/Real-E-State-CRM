import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './site-visit.service';

export const createSiteVisit = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const visit = await service.createSiteVisitService(agencyId, req.body);
  return successResponse(res, 'Site Visit created successfully', visit, 201);
};

export const getSiteVisits = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const visits = await service.getSiteVisitsService(agencyId, req.query);
  return successResponse(res, 'Site Visits retrieved successfully', visits);
};

export const getSiteVisitById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const visit = await service.getSiteVisitByIdService(req.params.id as string, agencyId);
  return successResponse(res, 'Site Visit retrieved successfully', visit);
};

export const updateSiteVisit = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const visit = await service.updateSiteVisitService(req.params.id as string, agencyId, req.body);
  return successResponse(res, 'Site Visit updated successfully', visit);
};

export const deleteSiteVisit = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deleteSiteVisitService(req.params.id as string, agencyId);
  return successResponse(res, 'Site Visit deleted successfully');
};
