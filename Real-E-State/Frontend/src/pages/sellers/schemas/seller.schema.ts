import * as Yup from 'yup';

const PHONE_REGEX = /^\d{10}$/;

export const sellerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters')
    .required('Name is required'),
  phone: Yup.string()
    .matches(PHONE_REGEX, 'Must be a valid 10-digit phone number')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .nullable()
    .optional(),
  property: Yup.string()
    .nullable()
    .optional(),
  expectedPrice: Yup.number()
    .typeError('Expected price must be a number')
    .positive('Expected price must be a positive number')
    .nullable()
    .optional(),
  sellingReason: Yup.string()
    .nullable()
    .optional(),
  assignedAgent: Yup.string()
    .nullable()
    .optional(),
  status: Yup.string()
    .nullable()
    .optional(),
  notes: Yup.string()
    .max(1000, 'Notes must be under 1000 characters')
    .nullable()
    .optional(),
});
