import * as Yup from 'yup';

export const projectSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  projectCode: Yup.string().nullable().optional(),
  developer: Yup.string().nullable().optional(),
  location: Yup.string().nullable().optional(),
  address: Yup.string().nullable().optional(),
  city: Yup.string().nullable().optional(),
  state: Yup.string().nullable().optional(),
  projectType: Yup.string().nullable().optional(),
  totalTowers: Yup.number().typeError('Must be a number').positive('Must be positive').integer().nullable().optional(),
  totalUnits: Yup.number().typeError('Must be a number').positive('Must be positive').integer().nullable().optional(),
  availableUnits: Yup.number().typeError('Must be a number').min(0, 'Must be zero or more').integer().nullable().optional(),
  amenities: Yup.array().of(Yup.string()).nullable().optional(),
  reraNumber: Yup.string().nullable().optional(),
  possessionDate: Yup.string().nullable().optional(),
  startingPrice: Yup.number().typeError('Must be a number').positive('Must be positive').nullable().optional(),
  description: Yup.string()
    .max(2000, 'Description must be under 2000 characters')
    .nullable()
    .optional(),
  status: Yup.string()
    .oneOf(['Planned', 'Active', 'Completed', 'On Hold'], 'Invalid status')
    .optional(),
});
