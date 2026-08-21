import * as Yup from 'yup';

export const documentSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be under 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(500, 'Description must be under 500 characters')
    .nullable()
    .optional(),
  fileUrl: Yup.string()
    .url('Must be a valid URL')
    .required('File URL is required'),
  fileType: Yup.string()
    .nullable()
    .optional(),
  relatedType: Yup.string()
    .nullable()
    .optional(),
  relatedId: Yup.string()
    .nullable()
    .optional(),
});
