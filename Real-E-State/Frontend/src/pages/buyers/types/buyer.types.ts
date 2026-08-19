export interface Buyer {
  _id: string;
  agencyId?: string;
  name: string;
  email?: string;
  phone: string;
  budget?: number;
  propertyType?: string;
  preferredLocation?: string;
  purpose?: 'Investment' | 'Residential' | 'Commercial' | 'Rental' | string;
  assignedAgent?: string | null;
  requirements?: string;
  status?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type BuyerFormValues = {
  name: string;
  email?: string;
  phone: string;
  budget?: number;
  propertyType?: string;
  preferredLocation?: string;
  purpose?: string;
  assignedAgent?: string;
  requirements?: string;
  status?: string;
  notes?: string;
};
