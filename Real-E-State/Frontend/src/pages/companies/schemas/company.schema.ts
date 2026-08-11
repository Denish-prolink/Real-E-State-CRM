import * as Yup from "yup";

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const PHONE_REGEX = /^\d{10}$/;

const baseSchemaFields = {
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Company name is required")
    .matches(/^[A-Za-z ]+$/, "Only letters and spaces are allowed"),
  gst: Yup.string()
    .transform(value => (value ? value.toUpperCase() : value))
    .matches(GST_REGEX, "Invalid GST format (e.g. 22AAAAA0000A1Z5)")
    .nullable()
    .notRequired(),
  sences: Yup.string(),
  pan: Yup.string()
    .transform(value => (value ? value.toUpperCase() : value))
    .matches(PAN_REGEX, "Invalid PAN format (e.g. ABCDE1234F)")
    .nullable()
    .notRequired(),
  members: Yup.number()
    .typeError("Members must be a number")
    .min(0, "Members cannot be negative")
    .max(100000, "Members count is too large")
    .required("Members count is required"),
  addressLine1: Yup.string()
    .max(500, "Address is too long")
    .required("Address Line 1 is required"),
  addressLine2: Yup.string()
    .max(500, "Address is too long")
    .nullable()
    .notRequired(),
  city: Yup.string()
    .max(100, "City name is too long")
    .required("City is required"),
  state: Yup.string()
    .max(100, "State name is too long")
    .required("State is required"),
  country: Yup.string()
    .max(100, "Country name is too long")
    .required("Country is required"),
  pincode: Yup.string()
    .max(20, "Pincode is too long")
    .required("Pincode is required"),
  contactNumber: Yup.string()
    .matches(PHONE_REGEX, "Must be a valid 10-digit phone number")
    .required("Contact number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  logo: Yup.string(),
  status: Yup.string()
    .oneOf(["active", "inactive"], "Invalid status")
    .required("Status is required"),
};

export const companySchema = Yup.object().shape({
  ...baseSchemaFields,
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const companyUpdateSchema = Yup.object().shape({
  ...baseSchemaFields,
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .nullable()
    .notRequired(),
});
