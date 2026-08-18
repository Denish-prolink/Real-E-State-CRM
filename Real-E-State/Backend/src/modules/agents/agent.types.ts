import { type Document, type Types } from 'mongoose';

export interface IAgent {
  userId?: Types.ObjectId;
  companyId: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  licenseNo?: string;
  active?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAgentDocument extends IAgent, Document {}
