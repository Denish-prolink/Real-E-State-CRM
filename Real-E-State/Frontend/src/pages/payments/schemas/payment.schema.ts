import * as Yup from 'yup';

export const paymentSchema = Yup.object().shape({
  paymentId: Yup.string().nullable().optional(),
  bookingId: Yup.string().nullable().optional(),
  customerId: Yup.string().nullable().optional(),
  amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
  paymentDate: Yup.date().nullable().optional(),
  paymentMethod: Yup.string()
    .oneOf(['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card', 'Online'], 'Invalid payment method')
    .nullable()
    .optional(),
  transactionId: Yup.string().nullable().optional(),
  paymentType: Yup.string().nullable().optional(),
  status: Yup.string()
    .oneOf(['Pending', 'Success', 'Failed', 'Refunded'], 'Invalid status')
    .nullable()
    .optional(),
  receipt: Yup.string().nullable().optional(),
  notes: Yup.string().max(2000, 'Notes must be under 2000 characters').nullable().optional(),
});
