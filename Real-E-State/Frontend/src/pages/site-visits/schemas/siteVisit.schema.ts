import * as Yup from 'yup';

export const siteVisitSchema = Yup.object().shape({
  leadId: Yup.string().nullable().optional(),
  buyerId: Yup.string().nullable().optional(),
  propertyId: Yup.string().nullable().optional(),
  projectId: Yup.string().nullable().optional(),
  unitId: Yup.string().nullable().optional(),
  agentId: Yup.string().nullable().optional(),
  visitDate: Yup.date().required('Visit date is required'),
  visitTime: Yup.string().nullable().optional(),
  location: Yup.string().nullable().optional(),
  status: Yup.string()
    .oneOf(['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'], 'Invalid status')
    .optional(),
  notes: Yup.string().max(2000, 'Notes must be under 2000 characters').nullable().optional(),
  feedback: Yup.string().max(2000, 'Feedback must be under 2000 characters').nullable().optional(),
});
