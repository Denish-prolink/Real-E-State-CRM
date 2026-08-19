import type { Document, Types } from 'mongoose';

export interface ISiteVisit {
  agencyId: Types.ObjectId;
  leadId?: Types.ObjectId;
  buyerId?: Types.ObjectId;
  propertyId?: Types.ObjectId;
  projectId?: Types.ObjectId;
  unitId?: Types.ObjectId;
  agentId?: Types.ObjectId;
  visitDate: Date;
  visitTime?: string;
  location?: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No Show';
  notes?: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISiteVisitDocument extends ISiteVisit, Document {}
