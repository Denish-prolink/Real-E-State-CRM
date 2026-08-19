import { Agent } from './agent.model';
import type { IAgent } from './agent.types';

export const createAgent = async (data: Partial<IAgent> & { agencyId: string }) => {
  const a = new Agent(data);
  return await a.save();
};

const buildFilter = (agencyId: string, search?: string) => {
  const base: any = { agencyId };
  if (!search) {
    return base;
  }
  return {
    agencyId,
    $or: [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ],
  };
};

export const getAgents = async (agencyId: string, search?: string) => {
  return Agent.find(buildFilter(agencyId, search)).sort({ firstName: 1 });
};

export const getAgentById = async (id: string, agencyId: string) => {
  return Agent.findOne({ _id: id, agencyId });
};

export const updateAgent = async (id: string, data: Partial<IAgent>, agencyId: string) => {
  return Agent.findOneAndUpdate({ _id: id, agencyId }, data, { new: true });
};

export const deleteAgent = async (id: string, agencyId: string) => {
  return Agent.findOneAndDelete({ _id: id, agencyId });
};
