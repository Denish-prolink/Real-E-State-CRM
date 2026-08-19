import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './lead.service';

export const createLead = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const lead = await service.createLeadService(agencyId, req.body);
  return successResponse(res, 'Lead created successfully', lead, 201);
};

export const getLeads = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const page = req.query.page ? Math.max(1, parseInt(req.query.page as string)) : undefined;
  const perPage = req.query.perPage
    ? Math.max(1, parseInt(req.query.perPage as string))
    : undefined;
  const search = (req.query.search as string) || undefined;

  const leads = await service.getLeadsService(agencyId, page, perPage, search);
  return successResponse(res, 'Leads retrieved successfully', leads);
};

export const getLeadById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const lead = await service.getLeadByIdService(req.params.id as string, agencyId);
  return successResponse(res, 'Lead retrieved successfully', lead);
};

export const updateLead = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const lead = await service.updateLeadService(req.params.id as string, agencyId, req.body);
  return successResponse(res, 'Lead updated successfully', lead);
};

export const deleteLead = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deleteLeadService(req.params.id as string, agencyId);
  return successResponse(res, 'Lead deleted successfully');
};
