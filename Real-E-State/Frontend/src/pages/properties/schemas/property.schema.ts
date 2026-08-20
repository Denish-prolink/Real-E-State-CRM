import * as Yup from 'yup';

export const propertySchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(5000, 'Description must be under 5000 characters')
    .nullable()
    .optional(),
  propertyType: Yup.string()
    .oneOf(
      ['Apartment', 'Villa', 'House', 'Plot', 'Office', 'Shop', 'Warehouse', 'Land', 'Commercial'],
      'Invalid property type'
    )
    .required('Property type is required'),
  purpose: Yup.string()
    .oneOf(['Sale', 'Rent', 'Lease'], 'Invalid purpose')
    .required('Purpose is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be a positive number')
    .required('Price is required'),
  area: Yup.number()
    .typeError('Area must be a number')
    .positive('Area must be a positive number')
    .required('Area is required'),
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
  parking: Yup.number()
    .typeError('Parking must be a number')
    .integer('Parking must be an integer')
    .min(0, 'Cannot be negative')
    .nullable()
    .optional(),
  location: Yup.object().shape({
    address: Yup.string().nullable().optional(),
    city: Yup.string().nullable().optional(),
    state: Yup.string().nullable().optional(),
    country: Yup.string().nullable().optional(),
    latitude: Yup.number().typeError('Must be a number').nullable().optional(),
    longitude: Yup.number().typeError('Must be a number').nullable().optional(),
  }).optional(),
  projectId: Yup.string().nullable().optional(),
  tower: Yup.string().nullable().optional(),
  floor: Yup.string().nullable().optional(),
  unitNumber: Yup.string().nullable().optional(),
  agentId: Yup.string().nullable().optional(),
  status: Yup.string()
    .oneOf(['Available', 'Reserved', 'Blocked', 'Booked', 'Sold'], 'Invalid status')
    .optional(),
  photos: Yup.array().of(Yup.string().required()).optional(),
});
