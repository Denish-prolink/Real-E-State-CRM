import * as Yup from 'yup';

export const warehouseSchema = Yup.object().shape({
  warehouseCode: Yup.string().required('Warehouse Code is required').max(50, 'Max 50 characters'),
  warehouseName: Yup.string()
    .required('Warehouse Name is required')
    .max(50, 'Max 50 characters')
    .matches(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  warehouseType: Yup.string()
    .oneOf(['Regular', 'Distribution Center', 'Cold Storage', 'Retail', 'Other'])
    .required('Warehouse Type is required'),
  manager: Yup.string().required('Manager is required'),
  addressLine1: Yup.string().required('Address Line 1 is required').max(200, 'Max 200 characters'),
  addressLine2: Yup.string().max(200, 'Max 200 characters'),
  city: Yup.string().required('City is required').max(50, 'Max 50 characters'),
  state: Yup.string().required('State is required').max(50, 'Max 50 characters'),
  country: Yup.string().required('Country is required').max(50, 'Max 50 characters'),
  pincode: Yup.string().required('Pincode is required').max(20, 'Max 20 characters'),
  capacity: Yup.number().required('Capacity is required').min(0, 'Capacity cannot be negative'),
});
