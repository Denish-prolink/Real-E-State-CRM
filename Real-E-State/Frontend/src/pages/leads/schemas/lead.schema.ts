import * as Yup from 'yup';

const PHONE_REGEX = /^\d{10}$/;

export const leadSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be under 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .max(50, 'Last name must be under 50 characters')
    .nullable()
    .optional(),
  phone: Yup.string()
    .matches(PHONE_REGEX, 'Must be a valid 10-digit phone number')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .nullable()
    .optional(),
  source: Yup.string()
    .oneOf(['Website', 'Facebook', 'Instagram', 'Google', 'WhatsApp', 'Referral', 'Property Portal', 'Walk-in', 'Phone', 'Other'], 'Invalid source')
    .optional(),
  status: Yup.string()
    .oneOf(['New', 'Contacted', 'Qualified', 'Site Visit', 'Negotiation', 'Converted', 'Lost'], 'Invalid status')
    .optional(),
  priority: Yup.string()
    .oneOf(['High', 'Medium', 'Low'], 'Invalid priority')
    .optional(),
  budget: Yup.number()
    .typeError('Budget must be a number')
    .positive('Budget must be a positive number')
    .nullable()
    .optional(),
  propertyType: Yup.string()
    .nullable()
    .optional(),
  preferredLocation: Yup.string()
    .nullable()
    .optional(),
  leadType: Yup.string()
    .nullable()
    .optional(),
  assignedAgent: Yup.string()
    .nullable()
    .optional(),
  nextFollowUp: Yup.string()
    .nullable()
    .optional(),
  notes: Yup.string()
    .max(1000, 'Notes must be under 1000 characters')
    .nullable()
    .optional(),
});
