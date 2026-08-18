import * as Yup from 'yup';

export const towerSchema = Yup.object().shape({
  projectId: Yup.string()
    .required('Project is required'),
  name: Yup.string()
    .min(1, 'Name is required')
    .required('Name is required'),
  floors: Yup.number()
    .typeError('Floors must be a number')
    .integer('Floors must be an integer')
    .min(0, 'Floors cannot be negative')
    .optional(),
  description: Yup.string()
    .max(1000, 'Description must be under 1000 characters')
    .nullable()
    .optional(),
});
