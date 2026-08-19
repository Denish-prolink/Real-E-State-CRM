export interface Buyer {
  _id: string;
  agencyId?: string;
  contactId?: string | null;
  leadId?: string | null;
  notes?: string;
  preferences?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export type BuyerFormValues = {
  contactId?: string;
  leadId?: string;
  notes?: string;
  preferences?: Record<string, any>;
};
