import { ApiError } from '../../common/exceptions/ApiError';

import * as repository from './agent.repository';
import type { IAgent } from './agent.types';

export const createAgent = async (data: Partial<IAgent> & { companyId: string }) => {
  return await repository.createAgent(data);
};

export const getAgents = async (companyId: string, search?: string) => {
  return await repository.getAgents(companyId, search);
};

export const getAgentById = async (id: string, companyId: string) => {
  const a = await repository.getAgentById(id, companyId);
  if (!a) throw new ApiError('Agent not found', 404);
  return a;
};

export const updateAgent = async (id: string, data: Partial<IAgent>, companyId: string) => {
  const a = await repository.updateAgent(id, data, companyId);
  if (!a) throw new ApiError('Agent not found', 404);
  return a;
};

export const deleteAgent = async (id: string, companyId: string) => {
  const a = await repository.deleteAgent(id, companyId);
  if (!a) throw new ApiError('Agent not found', 404);
  return a;
};
