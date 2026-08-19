import * as Yup from 'yup';

export const bookingSchema = Yup.object().shape({
  bookingNumber: Yup.string().nullable().optional(),
  customerId: Yup.string().nullable().optional(),
  propertyId: Yup.string().nullable().optional(),
  projectId: Yup.string().nullable().optional(),
  unitId: Yup.string().nullable().optional(),
  agentId: Yup.string().nullable().optional(),
  bookingDate: Yup.date().nullable().optional(),
  bookingAmount: Yup.number().nullable().optional().min(0, 'Booking amount cannot be negative'),
  totalAmount: Yup.number().nullable().optional().min(0, 'Total amount cannot be negative'),
  discount: Yup.number().nullable().optional().min(0, 'Discount cannot be negative'),
  tax: Yup.number().nullable().optional().min(0, 'Tax cannot be negative'),
  finalAmount: Yup.number().nullable().optional().min(0, 'Final amount cannot be negative'),
  paymentStatus: Yup.string()
    .oneOf(['Pending', 'Partial', 'Completed', 'Failed'], 'Invalid status')
    .optional(),
  bookingStatus: Yup.string()
    .oneOf(['Pending', 'Confirmed', 'Cancelled', 'Completed'], 'Invalid status')
    .optional(),
  notes: Yup.string().max(2000, 'Notes must be under 2000 characters').nullable().optional(),
});
