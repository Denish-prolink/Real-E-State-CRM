import * as Yup from "yup";

export const supplierSchema = Yup.object({
  supplierCode: Yup.string()
    .required("Supplier code is required")
    .max(20, "Supplier code cannot exceed 20 characters"),

  supplierName: Yup.string()
    .required("Supplier name is required")
    .min(2, "Supplier name must be at least 2 characters")
    .max(100, "Supplier name cannot exceed 100 characters")
    .matches(/^[A-Za-z ]+$/, "Only letters and spaces are allowed"),

  contactPerson: Yup.string()
    .required("Contact person is required")
    .min(2, "Contact person must be at least 2 characters")
    .max(50, "Contact person cannot exceed 50 characters")
    .matches(/^[A-Za-z ]+$/, "Only letters and spaces are allowed"),

  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),

  gstNumber: Yup.string()
    .required("GST number is required")
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/,
      "Enter a valid GST number"
    ),

  panNumber: Yup.string()
    .required("PAN number is required")
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Enter a valid PAN number"
    ),

  address: Yup.object({
    addressLine1: Yup.string()
      .required("Address Line 1 is required")
      .min(5, "Address is too short"),

    addressLine2: Yup.string(),

    city: Yup.string()
      .required("City is required")
      .matches(/^[A-Za-z ]+$/, "Only letters are allowed"),

    state: Yup.string()
      .required("State is required")
      .matches(/^[A-Za-z ]+$/, "Only letters are allowed"),

    country: Yup.string()
      .required("Country is required"),

    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
  }),

  supplierType: Yup.string()
    .required("Supplier type is required"),

  paymentTerms: Yup.string()
    .required("Payment terms are required"),

  creditLimit: Yup.number()
    .typeError("Credit limit must be a number")
    .min(0, "Credit limit cannot be negative")
    .required("Credit limit is required"),

  openingBalance: Yup.number()
    .typeError("Opening balance must be a number")
    .min(0, "Opening balance cannot be negative")
    .required("Opening balance is required"),

  bankDetails: Yup.object({
    bankName: Yup.string()
      .required("Bank name is required")
      .max(100, "Bank name cannot exceed 100 characters")
      .matches(/^[A-Za-z ]+$/, "Only letters and spaces are allowed"),

    accountNumber: Yup.string()
      .required("Account number is required")
      .matches(
        /^\d{9,18}$/,
        "Account number must be between 9 and 18 digits"
      ),

    ifscCode: Yup.string()
      .required("IFSC code is required")
      .matches(
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        "Enter a valid IFSC code"
      ),
  }),

  notes: Yup.string()
    .max(500, "Notes cannot exceed 500 characters"),

  status: Yup.string()
    .oneOf(["active", "inactive"])
    .required("Status is required"),
});