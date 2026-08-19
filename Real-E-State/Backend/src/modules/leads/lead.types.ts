import type { Document, Types } from 'mongoose';

export interface ILead {
  agencyId: Types.ObjectId;
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  leadType?: string;
  source: string;
  status: string;
  priority: string;
  budget?: number;
  propertyType?: string;
  preferredLocation?: string;
  assignedAgent?: Types.ObjectId;
  nextFollowUp?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead, Document {}
