import * as Yup from "yup";

export const productSchema = Yup.object({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .required("Title is required")
    .max(50, 'Max 50 characters'),

  description: Yup.string()
    .max(1000, "Description must be under 1000 characters"),

  manufacturingDate: Yup.string().required("Manufacturing date is required"),

  expiryDate: Yup.string().test(
    "expiry-after-mfg",
    "Expiry date must be after manufacturing date",
    function (value) {
      const { manufacturingDate } = this.parent;
      if (!value || !manufacturingDate) return true;
      return new Date(value) > new Date(manufacturingDate);
    }
  ),



  rawPrice: Yup.number()
    .typeError("Raw price must be a number")
    .positive("Raw price must be greater than 0")
    .required("Raw price is required"),

  salePrice: Yup.number()
    .typeError("Sale price must be a number")
    .positive("Sale price must be greater than 0")
    .required("Sale price is required"),


  category: Yup.string().required("Category is required"),

  subCategory: Yup.string(),

  status: Yup.string()
    .oneOf(["Active", "Inactive", "Discontinued"], "Invalid status")
    .required("Status is required"),

  images: Yup.array().of(Yup.string()),

  supplier: Yup.array()
    .of(Yup.string())
    .min(1, "Supplier is required")
    .required("Supplier is required"),
});
