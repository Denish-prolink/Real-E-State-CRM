import type { Response } from 'express';

import { successResponse } from '../../common/helpers/response.helper';
import { type AuthenticatedRequest, getAgencyId } from '../../middlewares/auth.middleware';

import * as service from './agent.service';

export const createAgent = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const agent = await service.createAgent({ ...req.body, agencyId });
  return successResponse(res, 'Agent created successfully', agent, 201);
};

export const getAgents = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const search = (req.query.search as string) || undefined;
  const agents = await service.getAgents(agencyId, search);
  return successResponse(res, 'Agents retrieved successfully', agents);
};

export const getAgentById = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const agent = await service.getAgentById(req.params.id as string, agencyId);
  return successResponse(res, 'Agent retrieved successfully', agent);
};

export const updateAgent = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  const agent = await service.updateAgent(req.params.id as string, req.body, agencyId);
  return successResponse(res, 'Agent updated successfully', agent);
};

export const deleteAgent = async (req: AuthenticatedRequest, res: Response) => {
  const agencyId = getAgencyId(req);
  await service.deleteAgent(req.params.id as string, agencyId);
  return successResponse(res, 'Agent deleted successfully');
};
