export interface Seller {
  _id: string;
  agencyId?: string;
  name: string;
  email?: string;
  phone: string;
  property?: string;
  expectedPrice?: number;
  sellingReason?: string;
  assignedAgent?: string | null;
  status?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SellerFormValues = {
  name: string;
  email?: string;
  phone: string;
  property?: string;
  expectedPrice?: number;
  sellingReason?: string;
  assignedAgent?: string;
  status?: string;
  notes?: string;
};
