export interface Lead {
  _id: string;
  companyId: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  source: 'Website' | 'Referral' | 'Social Media' | 'Cold Call' | 'WhatsApp' | 'Other';
  status: 'New' | 'Contacted' | 'Qualified' | 'Site Visit' | 'Negotiation' | 'Converted' | 'Lost';
  priority: 'High' | 'Medium' | 'Low';
  budget?: number;
  propertyType?: string;
  location?: string;
  bedrooms?: number;
  area?: number;
  assignedAgent?: {
    _id: string;
    firstName: string;
    lastName?: string;
    email: string;
  } | null;
  expectedPurchaseDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddLeadPayload = Omit<Lead, '_id' | 'companyId' | 'assignedAgent' | 'createdAt' | 'updatedAt'> & {
  assignedAgent?: string;
};
export type UpdateLeadPayload = Partial<AddLeadPayload>;
