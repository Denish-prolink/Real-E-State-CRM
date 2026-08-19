export interface Booking {
  _id: string;
  agencyId: string;
  bookingNumber?: string;
  customerId?: {
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
  bookingDate?: string;
  bookingAmount?: number;
  totalAmount?: number;
  discount?: number;
  tax?: number;
  finalAmount?: number;
  paymentStatus?: 'Pending' | 'Partial' | 'Completed' | 'Failed';
  bookingStatus?: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  documents?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddBookingPayload = Omit<Booking, '_id' | 'agencyId' | 'createdAt' | 'updatedAt'>;
export type UpdateBookingPayload = Partial<AddBookingPayload>;
