import * as Yup from 'yup';

export const projectSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  description: Yup.string()
    .max(2000, 'Description must be under 2000 characters')
    .nullable()
    .optional(),
  startDate: Yup.string().nullable().optional(),
  endDate: Yup.string().nullable().optional(),
  status: Yup.string()
    .oneOf(['Planned', 'Active', 'Completed', 'On Hold'], 'Invalid status')
    .optional(),
  address: Yup.string()
    .max(1000, 'Address must be under 1000 characters')
    .nullable()
    .optional(),
});
