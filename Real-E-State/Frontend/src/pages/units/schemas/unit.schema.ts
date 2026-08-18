import * as Yup from 'yup';

export const unitSchema = Yup.object().shape({
  projectId: Yup.string().nullable().optional(),
  towerId: Yup.string().nullable().optional(),
  unitNumber: Yup.string()
    .min(1, 'Unit number is required')
    .required('Unit number is required'),
  floor: Yup.string().nullable().optional(),
  size: Yup.number()
    .typeError('Size must be a number')
    .positive('Size must be positive')
    .nullable()
    .optional(),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .nullable()
    .optional(),
  bedrooms: Yup.number()
    .typeError('Bedrooms must be a number')
    .integer('Bedrooms must be an integer')
    .min(0, 'Cannot be negative')
    .nullable()
    .optional(),
  bathrooms: Yup.number()
    .typeError('Bathrooms must be a number')
    .integer('Bathrooms must be an integer')
    .min(0, 'Cannot be negative')
    .nullable()
    .optional(),
  status: Yup.string()
    .oneOf(['Available', 'Reserved', 'Booked', 'Sold'], 'Invalid status')
    .optional(),
});
