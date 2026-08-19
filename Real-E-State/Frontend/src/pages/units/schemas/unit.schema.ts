import * as Yup from 'yup';

export const unitSchema = Yup.object().shape({
  projectId: Yup.string().nullable().optional(),
  towerId: Yup.string().nullable().optional(),
  tower: Yup.string().nullable().optional(),
  floor: Yup.string().nullable().optional(),
  unitNumber: Yup.string()
    .min(1, 'Unit number is required')
    .required('Unit number is required'),
  unitType: Yup.string().nullable().optional(),
  bhk: Yup.string().nullable().optional(),
  area: Yup.number()
    .typeError('Area must be a number')
    .positive('Area must be positive')
    .nullable()
    .optional(),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .nullable()
    .optional(),
  facing: Yup.string().nullable().optional(),
  status: Yup.string()
    .oneOf(['Available', 'Hold', 'Booked', 'Sold', 'Blocked'], 'Invalid status')
    .optional(),
});
