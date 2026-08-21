export interface Seller {
  _id: string;
  agencyId?: string;
  contactId?: string | null;
  leadId?: string | null;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export type SellerFormValues = {
  contactId?: string;
  leadId?: string;
  notes?: string;
  metadata?: Record<string, any>;
};
