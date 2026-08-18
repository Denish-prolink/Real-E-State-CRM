import { Agent } from './agent.model';
import type { IAgent } from './agent.types';

export const createAgent = async (data: Partial<IAgent> & { companyId: string }) => {
  const a = new Agent(data);
  return await a.save();
};

const buildFilter = (companyId: string, search?: string) => {
  const base: any = { companyId };
  if (!search) return base;
  return {
    companyId,
    $or: [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ],
  };
};

export const getAgents = async (companyId: string, search?: string) => {
  return Agent.find(buildFilter(companyId, search)).sort({ firstName: 1 });
};

export const getAgentById = async (id: string, companyId: string) => {
  return Agent.findOne({ _id: id, companyId });
};

export const updateAgent = async (id: string, data: Partial<IAgent>, companyId: string) => {
  return Agent.findOneAndUpdate({ _id: id, companyId }, data, { new: true });
};

export const deleteAgent = async (id: string, companyId: string) => {
  return Agent.findOneAndDelete({ _id: id, companyId });
};
