import * as Yup from 'yup';

export const propertySchema = Yup.object().shape({
  propertyName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  propertyId: Yup.string().nullable().optional(),
  propertyType: Yup.string()
    .oneOf(
      ['Apartment', 'Villa', 'House', 'Office', 'Shop', 'Warehouse', 'Land', 'Plot', 'Commercial'],
      'Invalid property type'
    )
    .required('Property type is required'),
  category: Yup.string().nullable().optional(),
  address: Yup.string().nullable().optional(),
  city: Yup.string().nullable().optional(),
  state: Yup.string().nullable().optional(),
  country: Yup.string().nullable().optional(),
  pincode: Yup.string().nullable().optional(),
  latitude: Yup.number().typeError('Must be a number').nullable().optional(),
  longitude: Yup.number().typeError('Must be a number').nullable().optional(),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be a positive number')
    .required('Price is required'),
  area: Yup.number()
    .typeError('Area must be a number')
    .positive('Area must be a positive number')
    .required('Area is required'),
  areaUnit: Yup.string().nullable().optional(),
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
  furnishedStatus: Yup.string().nullable().optional(),
  constructionStatus: Yup.string().nullable().optional(),
  ownership: Yup.string().nullable().optional(),
  facing: Yup.string().nullable().optional(),
  description: Yup.string()
    .max(5000, 'Description must be under 5000 characters')
    .nullable()
    .optional(),
  amenities: Yup.array().of(Yup.string()).nullable().optional(),
  agentId: Yup.string().nullable().optional(),
  status: Yup.string()
    .oneOf(['Available', 'Reserved', 'Sold', 'Rented', 'Inactive'], 'Invalid status')
    .optional(),
});
