export interface Payment {
  _id: string;
  agencyId: string;
  paymentId?: string;
  bookingId?: {
    _id: string;
    bookingNumber: string;
  } | string | null;
  customerId?: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string | null;
  amount: number;
  paymentDate?: string;
  paymentMethod?: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card' | 'Online';
  transactionId?: string;
  paymentType?: string;
  status?: 'Pending' | 'Success' | 'Failed' | 'Refunded';
  receipt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddPaymentPayload = Omit<Payment, '_id' | 'agencyId' | 'createdAt' | 'updatedAt'>;
export type UpdatePaymentPayload = Partial<AddPaymentPayload>;
