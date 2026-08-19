import type { Document, Types } from 'mongoose';

export interface IDeal {
  agencyId: Types.ObjectId;
  dealId?: string;
  leadId: Types.ObjectId;
  buyerId?: Types.ObjectId;
  sellerId?: Types.ObjectId;
  propertyId?: Types.ObjectId;
  projectId?: Types.ObjectId;
  unitId?: Types.ObjectId;
  agentId?: Types.ObjectId;
  dealAmount: number;
  commission?: number;
  discount?: number;
  expectedClosingDate?: Date;
  closingDate?: Date;
  status:
    | 'Lead'
    | 'Qualified'
    | 'Site Visit'
    | 'Negotiation'
    | 'Booking'
    | 'Agreement'
    | 'Closed'
    | 'Lost';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDealDocument extends IDeal, Document {}
