import { ApiError } from '../../common/exceptions/ApiError';

import * as repository from './agent.repository';
import type { IAgent } from './agent.types';

export const createAgent = async (data: Partial<IAgent> & { agencyId: string }) => {
  return await repository.createAgent(data);
};

export const getAgents = async (agencyId: string, search?: string) => {
  return await repository.getAgents(agencyId, search);
};

export const getAgentById = async (id: string, agencyId: string) => {
  const a = await repository.getAgentById(id, agencyId);
  if (!a) {
    throw new ApiError('Agent not found', 404);
  }
  return a;
};

export const updateAgent = async (id: string, data: Partial<IAgent>, agencyId: string) => {
  const a = await repository.updateAgent(id, data, agencyId);
  if (!a) {
    throw new ApiError('Agent not found', 404);
  }
  return a;
};

export const deleteAgent = async (id: string, agencyId: string) => {
  const a = await repository.deleteAgent(id, agencyId);
  if (!a) {
    throw new ApiError('Agent not found', 404);
  }
  return a;
};
