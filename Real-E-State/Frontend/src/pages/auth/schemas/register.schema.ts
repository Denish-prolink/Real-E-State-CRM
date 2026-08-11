import * as Yup from "yup";

export const registerSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "Minimum 2 characters")
    .required("First name is required")
    .matches(/^[A-Za-z ]+$/, "Only letters and spaces are allowed"),

  lastName: Yup.string()
    .min(2, "Minimum 2 characters")
    .required("Last name is required")
    .matches(/^[A-Za-z ]+$/, "Only letters and spaces are allowed"),

  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
});
