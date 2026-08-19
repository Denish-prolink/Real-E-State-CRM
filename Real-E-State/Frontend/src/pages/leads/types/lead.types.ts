export interface Lead {
  _id: string;
  agencyId: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  leadType?: string;
  source: 'Website' | 'Facebook' | 'Instagram' | 'Google' | 'WhatsApp' | 'Referral' | 'Property Portal' | 'Walk-in' | 'Phone' | 'Other';
  status: 'New' | 'Contacted' | 'Qualified' | 'Site Visit' | 'Negotiation' | 'Converted' | 'Lost';
  priority: 'High' | 'Medium' | 'Low';
  budget?: number;
  propertyType?: string;
  preferredLocation?: string;
  assignedAgent?: {
    _id: string;
    firstName: string;
    lastName?: string;
    email: string;
  } | null;
  nextFollowUp?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddLeadPayload = Omit<Lead, '_id' | 'agencyId' | 'assignedAgent' | 'createdAt' | 'updatedAt'> & {
  assignedAgent?: string;
};
export type UpdateLeadPayload = Partial<AddLeadPayload>;
