import * as Yup from 'yup';

export const followUpSchema = Yup.object().shape({
  leadId: Yup.string().nullable().optional(),
  customerId: Yup.string().nullable().optional(),
  agentId: Yup.string().nullable().optional(),
  followUpType: Yup.string()
    .oneOf(['Call', 'WhatsApp', 'Email', 'Meeting', 'Site Visit', 'Other'], 'Invalid type')
    .nullable()
    .optional(),
  date: Yup.date().nullable().optional(),
  time: Yup.string().nullable().optional(),
  status: Yup.string().nullable().optional(),
  notes: Yup.string().max(2000, 'Notes must be under 2000 characters').nullable().optional(),
  nextFollowUp: Yup.date().nullable().optional(),
});
