import * as Yup from 'yup';

export const dealSchema = Yup.object().shape({
  dealId: Yup.string().nullable().optional(),
  leadId: Yup.string().required('Lead is required'),
  buyerId: Yup.string().nullable().optional(),
  sellerId: Yup.string().nullable().optional(),
  propertyId: Yup.string().nullable().optional(),
  projectId: Yup.string().nullable().optional(),
  unitId: Yup.string().nullable().optional(),
  agentId: Yup.string().nullable().optional(),
  dealAmount: Yup.number().required('Deal amount is required').positive('Deal amount must be positive'),
  commission: Yup.number().nullable().optional().min(0, 'Commission cannot be negative'),
  discount: Yup.number().nullable().optional().min(0, 'Discount cannot be negative'),
  expectedClosingDate: Yup.date().nullable().optional(),
  closingDate: Yup.date().nullable().optional(),
  status: Yup.string()
    .oneOf(['Lead', 'Qualified', 'Site Visit', 'Negotiation', 'Booking', 'Agreement', 'Closed', 'Lost'], 'Invalid status')
    .optional(),
  notes: Yup.string().max(2000, 'Notes must be under 2000 characters').nullable().optional(),
});
