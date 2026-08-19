export interface Deal {
  _id: string;
  agencyId: string;
  dealId?: string;
  leadId: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string;
  buyerId?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string | null;
  sellerId?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string | null;
  propertyId?: {
    _id: string;
    propertyName: string;
  } | string | null;
  projectId?: {
    _id: string;
    name: string;
  } | string | null;
  unitId?: {
    _id: string;
    unitNumber: string;
  } | string | null;
  agentId?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string | null;
  dealAmount: number;
  commission?: number;
  discount?: number;
  expectedClosingDate?: string;
  closingDate?: string;
  status: 'Lead' | 'Qualified' | 'Site Visit' | 'Negotiation' | 'Booking' | 'Agreement' | 'Closed' | 'Lost';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddDealPayload = Omit<Deal, '_id' | 'agencyId' | 'createdAt' | 'updatedAt' | 'leadId' | 'buyerId' | 'sellerId' | 'propertyId' | 'projectId' | 'unitId' | 'agentId'> & {
  leadId: string;
  buyerId?: string;
  sellerId?: string;
  propertyId?: string;
  projectId?: string;
  unitId?: string;
  agentId?: string;
};
export type UpdateDealPayload = Partial<AddDealPayload>;
