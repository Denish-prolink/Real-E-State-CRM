import * as Yup from "yup";

export const categorySchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required")
    .max(50, 'Max 50 characters')
    .matches(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  description: Yup.string()
    .max(500, "Description must be under 500 characters"),
});
