import { Document, Types } from 'mongoose';

export interface ISiteVisit {
  companyId: Types.ObjectId;
  leadId: Types.ObjectId;
  propertyId?: Types.ObjectId;
  agentId?: Types.ObjectId;
  visitDate: Date;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'No Show';
  feedback?: string;
  rating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISiteVisitDocument extends ISiteVisit, Document {}
