import * as Yup from "yup";

export const skuSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required")
    .max(50, 'Max 50 characters')
    .matches(/^[A-Za-z ]+$/, 'Only letters and spaces are allowed'),
  unit: Yup.string()
    .oneOf(['ml', 'DOZEN', 'BOX', 'GRAMS', 'KILOGRAMS', 'METERS', 'TABLETS', 'UNITS', 'PIECES', 'PAIRS'], 'Invalid unit')
    .required("Unit is required"),
  skuCode: Yup.string()
    .min(1, "SKU Code is required")
    .required("SKU Code is required")
    .max(50, 'Max 50 characters'),
  description: Yup.string()
    .max(500, "Description must be under 500 characters"),
});
