import { type Document, type Types } from 'mongoose';

export interface ISeller {
  companyId: Types.ObjectId;
  contactId?: Types.ObjectId;
  leadId?: Types.ObjectId;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISellerDocument extends ISeller, Document {}
