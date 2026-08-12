import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getCompanyId } from '../../middlewares/auth.middleware';

import * as service from './lead.service';

export const createLead = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const lead = await service.createLeadService(companyId, req.body);
  return successResponse(res, 'Lead created successfully', lead, 201);
};

export const getLeads = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const leads = await service.getLeadsService(companyId, req.query);
  return successResponse(res, 'Leads retrieved successfully', leads);
};

export const getLeadById = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const lead = await service.getLeadByIdService(req.params.id as string, companyId);
  return successResponse(res, 'Lead retrieved successfully', lead);
};

export const updateLead = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  const lead = await service.updateLeadService(req.params.id as string, companyId, req.body);
  return successResponse(res, 'Lead updated successfully', lead);
};

export const deleteLead = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = getCompanyId(req);
  await service.deleteLeadService(req.params.id as string, companyId);
  return successResponse(res, 'Lead deleted successfully');
};
