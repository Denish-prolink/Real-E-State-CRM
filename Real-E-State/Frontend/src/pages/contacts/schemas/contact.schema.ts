import * as Yup from 'yup';

const PHONE_REGEX = /^\d{10}$/;

export const contactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required')
    .matches(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  type: Yup.string()
    .oneOf(['customer', 'supplier'], 'Invalid type')
    .required('Type is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  mobileNo: Yup.string()
    .matches(PHONE_REGEX, 'Must be a valid 10-digit phone number')
    .required('Mobile Number is required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Gender is required')
    .required('Gender is required'),
  dob: Yup.string()
    .nullable()
    .test('not-future-date', 'Date of Birth cannot be in the future', (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(value);
      return inputDate <= today;
    }),
  address: Yup.string().max(500, 'Address must be under 500 characters').nullable(),
  notes: Yup.string().max(500, 'Notes must be under 500 characters').nullable(),
});
