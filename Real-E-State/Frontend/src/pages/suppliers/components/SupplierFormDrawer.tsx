import { useEffect } from "react";
import { useFormik } from "formik";
import { supplierSchema } from "../schemas/supplier.schema";
import type { Supplier, SupplierFormValues } from "../types/supplier.types";
import { useGetSupplier } from "../hooks/useGetSupplier";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SupplierFormValues) => void | Promise<void>;
  editSupplierId?: string | null;
}

const EMPTY_VALUES: SupplierFormValues = {
  supplierCode: "",
  supplierName: "",
  contactPerson: "",
  mobile: "",
  email: "",
  gstNumber: "",
  panNumber: "",
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  },
  supplierType: "",
  paymentTerms: "",
  creditLimit: 0,
  openingBalance: 0,
  bankDetails: {
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  },
  notes: "",
  status: "active",
};

import { FormLabel, SectionTitle, FieldError } from "@/components/common/FormHelpers";
import { getInputClassName } from "@/components/common/formUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function SupplierFormDrawer({
  open,
  onClose,
  onSubmit,
  editSupplierId,
}: Props) {
  const { data: supplierResponse, isLoading: isSupplierLoading } = useGetSupplier(editSupplierId || "", !!editSupplierId);
  const editSupplier = supplierResponse?.data as Supplier | undefined;

  const formik = useFormik<SupplierFormValues>({
    initialValues: EMPTY_VALUES,
    validationSchema: supplierSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        await onSubmit(values);
        helpers.resetForm();
      } catch (err) {
        const error = err as { message?: string };
        if (error.message && error.message.toLowerCase().includes("already exists")) {
          helpers.setFieldError("supplierCode", error.message);
        }
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (editSupplierId && editSupplier) {
        formik.resetForm({
          values: {
            supplierCode: editSupplier.supplierCode || "",
            supplierName: editSupplier.supplierName || "",
            contactPerson: editSupplier.contactPerson || "",
            mobile: editSupplier.mobile || "",
            email: editSupplier.email || "",
            gstNumber: editSupplier.gstNumber || "",
            panNumber: editSupplier.panNumber || "",
            address: {
              addressLine1: editSupplier.address?.addressLine1 || "",
              addressLine2: editSupplier.address?.addressLine2 || "",
              city: editSupplier.address?.city || "",
              state: editSupplier.address?.state || "",
              country: editSupplier.address?.country || "",
              pincode: editSupplier.address?.pincode || "",
            },
            supplierType: editSupplier.supplierType || "",
            paymentTerms: editSupplier.paymentTerms || "",
            creditLimit: editSupplier.creditLimit || 0,
            openingBalance: editSupplier.openingBalance || 0,
            bankDetails: {
              bankName: editSupplier.bankDetails?.bankName || "",
              accountNumber: editSupplier.bankDetails?.accountNumber || "",
              ifscCode: editSupplier.bankDetails?.ifscCode || "",
            },
            notes: editSupplier.notes || "",
            status: editSupplier.status || "active",
          },
        });
      } else if (!editSupplierId) {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editSupplierId, editSupplier]);

  const inputCls = (field: string) => getInputClassName(
    formik.errors,
    formik.touched,
    formik.submitCount,
    field,
    "h-9 w-full rounded-lg border px-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors",
    "border-red-400 bg-red-50/30"
  );

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
       <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col"
      >
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {editSupplierId ? "Edit Supplier" : "Add Supplier"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {editSupplierId
                  ? "Update the details of the supplier below."
                  : "Create a new supplier profile."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="flex-1 px-6 pt-4 flex flex-col gap-5"
          noValidate
        >
          {/* ── BASIC INFO ── */}
          <SectionTitle>Basic Information</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="supplierCode" required>Supplier Code</FormLabel>
              <Input
                id="supplierCode"
                name="supplierCode"
                placeholder="e.g. SUP-001"
                value={formik.values.supplierCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("supplierCode")}
              />
              <FieldError error={formik.errors.supplierCode} touched={formik.touched.supplierCode} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="supplierName" required>Supplier Name</FormLabel>
              <Input
                id="supplierName"
                name="supplierName"
                placeholder="e.g. TechWorld Distributors"
                value={formik.values.supplierName}
                onChange={(e) => {
                  formik.handleChange(e);
                  const val = e.target.value;
                  if (val.length >= 100) {
                    formik.setFieldTouched("supplierName", true, true);
                  } else {
                    formik.setFieldTouched("supplierName", false, false);
                  }
                }}
                onBlur={formik.handleBlur}
                className={inputCls("supplierName")}
              />
              <FieldError error={formik.errors.supplierName} touched={formik.touched.supplierName} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="contactPerson" required>Contact Person</FormLabel>
              <Input
                id="contactPerson"
                name="contactPerson"
                placeholder="e.g. John Doe"
                value={formik.values.contactPerson}
                onChange={(e) => {
                  formik.handleChange(e);
                  const val = e.target.value;
                  if (val.length >= 50) {
                    formik.setFieldTouched("contactPerson", true, true);
                  } else {
                    formik.setFieldTouched("contactPerson", false, false);
                  }
                }}
                onBlur={formik.handleBlur}
                className={inputCls("contactPerson")}
              />
              <FieldError error={formik.errors.contactPerson} touched={formik.touched.contactPerson} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="mobile" required>Mobile</FormLabel>
              <Input
                id="mobile"
                name="mobile"
                placeholder="e.g. +91 9876543210"
                value={formik.values.mobile}
                onChange={(e) => {
                  formik.handleChange(e);
                  const val = e.target.value;
                  if (val.length >= 10) {
                    formik.setFieldTouched("mobile", true, true);
                  } else {
                    formik.setFieldTouched("mobile", false, false);
                  }
                }}
                onBlur={formik.handleBlur}
                className={inputCls("mobile")}
              />
              <FieldError error={formik.errors.mobile} touched={formik.touched.mobile} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="email" required>Email</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. contact@techworld.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("email")}
              />
              <FieldError error={formik.errors.email} touched={formik.touched.email} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="supplierType" required>Supplier Type</FormLabel>
              <Input
                id="supplierType"
                name="supplierType"
                placeholder="e.g. Wholesale"
                value={formik.values.supplierType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("supplierType")}
              />
              <FieldError error={formik.errors.supplierType} touched={formik.touched.supplierType} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="gstNumber" required>GST Number</FormLabel>
              <Input
                id="gstNumber"
                name="gstNumber"
                placeholder="e.g. 22AAAAA0000A1Z5"
                value={formik.values.gstNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("gstNumber")}
              />
              <FieldError error={formik.errors.gstNumber} touched={formik.touched.gstNumber} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="panNumber" required>PAN Number</FormLabel>
              <Input
                id="panNumber"
                name="panNumber"
                placeholder="e.g. ABCDE1234F"
                value={formik.values.panNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("panNumber")}
              />
              <FieldError error={formik.errors.panNumber} touched={formik.touched.panNumber} submitCount={formik.submitCount} />
            </div>
          </div>

          {/* ── ADDRESS ── */}
          <SectionTitle>Address Information</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="address.addressLine1" required>Address Line 1</FormLabel>
              <Input
                id="address.addressLine1"
                name="address.addressLine1"
                placeholder="e.g. 123 Main Street"
                value={formik.values.address.addressLine1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("address.addressLine1")}
              />
              <FieldError error={formik.errors.address?.addressLine1} touched={formik.touched.address?.addressLine1} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="address.addressLine2">Address Line 2</FormLabel>
              <Input
                id="address.addressLine2"
                name="address.addressLine2"
                placeholder="e.g. Building A, Floor 2"
                value={formik.values.address.addressLine2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("address.addressLine2")}
              />
            </div>

            <div>
              <FormLabel htmlFor="address.city" required>City</FormLabel>
              <Input
                id="address.city"
                name="address.city"
                placeholder="e.g. Mumbai"
                value={formik.values.address.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("address.city")}
              />
              <FieldError error={formik.errors.address?.city} touched={formik.touched.address?.city} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="address.state" required>State</FormLabel>
              <Input
                id="address.state"
                name="address.state"
                placeholder="e.g. Maharashtra"
                value={formik.values.address.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("address.state")}
              />
              <FieldError error={formik.errors.address?.state} touched={formik.touched.address?.state} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="address.country" required>Country</FormLabel>
              <Input
                id="address.country"
                name="address.country"
                placeholder="e.g. India"
                value={formik.values.address.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("address.country")}
              />
              <FieldError error={formik.errors.address?.country} touched={formik.touched.address?.country} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="address.pincode" required>Pincode</FormLabel>
              <Input
                id="address.pincode"
                name="address.pincode"
                placeholder="e.g. 400001"
                value={formik.values.address.pincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("address.pincode")}
              />
              <FieldError error={formik.errors.address?.pincode} touched={formik.touched.address?.pincode} submitCount={formik.submitCount} />
            </div>
          </div>

          {/* ── FINANCIAL DETAILS ── */}
          <SectionTitle>Financial Details</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <FormLabel htmlFor="paymentTerms" required>Payment Terms</FormLabel>
              <Input
                id="paymentTerms"
                name="paymentTerms"
                placeholder="e.g. Net 30, Cash on Delivery"
                value={formik.values.paymentTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("paymentTerms")}
              />
              <FieldError error={formik.errors.paymentTerms} touched={formik.touched.paymentTerms} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="creditLimit" required>Credit Limit (₹)</FormLabel>
              <Input
                id="creditLimit"
                name="creditLimit"
                type="number"
                min={0}
                placeholder="0.00"
                value={formik.values.creditLimit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("creditLimit")}
              />
              <FieldError error={formik.errors.creditLimit} touched={formik.touched.creditLimit} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="openingBalance" required>Opening Balance (₹)</FormLabel>
              <Input
                id="openingBalance"
                name="openingBalance"
                type="number"
                min={0}
                placeholder="0.00"
                value={formik.values.openingBalance}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("openingBalance")}
              />
              <FieldError error={formik.errors.openingBalance} touched={formik.touched.openingBalance} submitCount={formik.submitCount} />
            </div>
            
            <div>
              <FormLabel htmlFor="status" required>Status</FormLabel>
              <Select
                value={formik.values.status}
                onValueChange={(val) => formik.setFieldValue("status", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("status"))}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
            </div>
          </div>

          {/* ── BANK DETAILS ── */}
          <SectionTitle>Bank Details</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <FormLabel htmlFor="bankDetails.bankName" required>Bank Name</FormLabel>
              <Input
                id="bankDetails.bankName"
                name="bankDetails.bankName"
                placeholder="e.g. HDFC Bank"
                value={formik.values.bankDetails.bankName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("bankDetails.bankName")}
              />
              <FieldError error={formik.errors.bankDetails?.bankName} touched={formik.touched.bankDetails?.bankName} submitCount={formik.submitCount} />
            </div>
            <div>
              <FormLabel htmlFor="bankDetails.accountNumber" required>Account Number</FormLabel>
              <Input
                id="bankDetails.accountNumber"
                name="bankDetails.accountNumber"
                placeholder="e.g. 50100234567890"
                value={formik.values.bankDetails.accountNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("bankDetails.accountNumber")}
              />
              <FieldError error={formik.errors.bankDetails?.accountNumber} touched={formik.touched.bankDetails?.accountNumber} submitCount={formik.submitCount} />
            </div>
            <div>
              <FormLabel htmlFor="bankDetails.ifscCode" required>IFSC Code</FormLabel>
              <Input
                id="bankDetails.ifscCode"
                name="bankDetails.ifscCode"
                placeholder="e.g. HDFC0001234"
                value={formik.values.bankDetails.ifscCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("bankDetails.ifscCode")}
              />
              <FieldError error={formik.errors.bankDetails?.ifscCode} touched={formik.touched.bankDetails?.ifscCode} submitCount={formik.submitCount} />
            </div>
          </div>

          {/* ── ADDITIONAL INFO ── */}
          <SectionTitle>Additional Info</SectionTitle>
          <div>
            <FormLabel htmlFor="notes">Notes</FormLabel>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Additional notes..."
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
            />
          </div>

          {/* ── ACTIONS ── */}
          <div className="sticky bottom-0 bg-card border-t border-border -mx-6 px-6 py-4 mt-auto flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || isSupplierLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
            >
              {formik.isSubmitting || isSupplierLoading
                ? "Saving..."
                : editSupplierId
                ? "Update Supplier"
                : "Add Supplier"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
