import { Document, Types } from 'mongoose';

export interface IDeal {
  agencyId: Types.ObjectId;
  dealNumber?: string;
  leadId: Types.ObjectId;
  propertyId?: Types.ObjectId;
  agentId?: Types.ObjectId;
  dealValue: number;
  discount?: number;
  expectedClosingDate?: Date;
  stage: 'New' | 'Qualified' | 'Site Visit' | 'Negotiation' | 'Booking' | 'Won' | 'Lost';
  probability?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDealDocument extends IDeal, Document {}
