import { Document, Types } from 'mongoose';

export interface ILead {
  companyId: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  source: string;
  status: string;
  priority: string;
  budget?: number;
  propertyType?: string;
  location?: string;
  bedrooms?: number;
  area?: number;
  assignedAgent?: Types.ObjectId;
  expectedPurchaseDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead, Document {}
