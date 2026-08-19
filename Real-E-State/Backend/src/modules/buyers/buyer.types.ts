import { type Document, type Types } from 'mongoose';

export interface IBuyer {
  agencyId: Types.ObjectId;
  contactId?: Types.ObjectId;
  leadId?: Types.ObjectId;
  notes?: string;
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBuyerDocument extends IBuyer, Document {}
