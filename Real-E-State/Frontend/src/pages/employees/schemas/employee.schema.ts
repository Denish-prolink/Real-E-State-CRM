import * as Yup from 'yup';

const PHONE_REGEX = /^\d{10}$/;

export const employeeSchema = Yup.object().shape({
  employeeCode: Yup.string().required('Employee Code is required').max(50, 'Max 50 characters'),
  firstName: Yup.string()
    .required('First Name is required')
    .max(50, 'Max 50 characters')
    .matches(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  lastName: Yup.string()
    .required('Last Name is required')
    .max(50, 'Max 50 characters')
    .matches(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  mobileNo: Yup.string()
    .matches(PHONE_REGEX, 'Must be a valid 10-digit phone number')
    .required('Mobile Number is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  department: Yup.string().required('Department is required').max(50, 'Max 50 characters'),
  designation: Yup.string().required('Designation is required').max(50, 'Max 50 characters'),
  joiningDate: Yup.date().required('Joining Date is required'),
  gender: Yup.string().oneOf(['male', 'female', 'other'], 'Gender is required').required('Gender is required'),
  dob: Yup.string()
    .nullable()
    .test('not-future-date', 'Date of Birth cannot be in the future', (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(value);
      return inputDate <= today;
    }),
  address: Yup.string().max(200, 'Max 200 characters').nullable(),
});
