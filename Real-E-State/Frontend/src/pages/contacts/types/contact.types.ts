export interface Contact {
  _id: string;
  name: string;
  type: 'customer' | 'supplier' | 'vendor' | 'seller' | 'other';
  email: string;
  mobileNo: string;
  gender: 'male' | 'female' | 'other' | '';
  dob?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddContactPayload = Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateContactPayload = Partial<AddContactPayload>;
