export interface FollowUp {
  _id: string;
  agencyId: string;
  leadId?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string | null;
  customerId?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string | null;
  agentId?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string | null;
  followUpType?: 'Call' | 'WhatsApp' | 'Email' | 'Meeting' | 'Site Visit' | 'Other';
  date?: string;
  time?: string;
  status?: string;
  notes?: string;
  nextFollowUp?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddFollowUpPayload = Omit<FollowUp, '_id' | 'agencyId' | 'createdAt' | 'updatedAt'>;
export type UpdateFollowUpPayload = Partial<AddFollowUpPayload>;
