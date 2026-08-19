import type { SellerFormValues, Seller } from "../types/seller.types";
import { FieldError, FormLabel, SectionTitle } from "@/components/common/FormHelpers";
import { getInputClassName } from "@/components/common/formUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { sellerSchema } from "../schemas/seller.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetEmployees } from "../../employees/hooks/useGetEmployees";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SellerFormValues) => void | Promise<void>;
  sellerToEdit?: Seller | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: SellerFormValues = {
  name: "",
  phone: "",
  email: "",
  property: "",
  expectedPrice: undefined,
  sellingReason: "",
  assignedAgent: "",
  status: "New",
  notes: "",
};

export default function SellerFormDrawer({
  open,
  onClose,
  onSubmit,
  sellerToEdit,
  isSubmitting = false,
}: Props) {
  const { data: employeesData } = useGetEmployees();
  const employees = employeesData || [];

  const formik = useFormik<SellerFormValues>({
    initialValues: EMPTY_VALUES,
    validationSchema: sellerSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.email) delete payload.email;
        if (!payload.assignedAgent) delete payload.assignedAgent;
        if (!payload.notes) delete payload.notes;
        if (!payload.property) delete payload.property;
        if (!payload.sellingReason) delete payload.sellingReason;

        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (sellerToEdit) {
        formik.resetForm({
          values: {
            name: sellerToEdit.name,
            phone: sellerToEdit.phone,
            email: sellerToEdit.email || "",
            property: sellerToEdit.property || "",
            expectedPrice: sellerToEdit.expectedPrice || undefined,
            sellingReason: sellerToEdit.sellingReason || "",
            assignedAgent: sellerToEdit.assignedAgent || "",
            status: sellerToEdit.status || "New",
            notes: sellerToEdit.notes || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sellerToEdit]);

  const inputCls = (field: keyof SellerFormValues) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {sellerToEdit ? "Edit Seller" : "Add Seller"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {sellerToEdit
                  ? "Update the details of the seller below."
                  : "Create a new seller profile in your CRM system."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="flex-1 px-6 pt-4 flex flex-col gap-5 relative pb-6" noValidate>
          <SectionTitle>Basic Contact Info</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="name" required>Name</FormLabel>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Rahul Patel"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("name")}
              />
              <FieldError error={formik.errors.name} touched={formik.touched.name} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="phone" required>Phone Number</FormLabel>
              <Input
                id="phone"
                name="phone"
                placeholder="e.g. 9876543210"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("phone")}
              />
              <FieldError error={formik.errors.phone} touched={formik.touched.phone} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. rahul@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("email")}
              />
              <FieldError error={formik.errors.email} touched={formik.touched.email} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="status">Status</FormLabel>
              <Select
                value={formik.values.status}
                onValueChange={(val) => formik.setFieldValue("status", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("status"))}>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Property & Expectations</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="property">Property Reference</FormLabel>
              <Input
                id="property"
                name="property"
                placeholder="e.g. Sunset Villas 204"
                value={formik.values.property}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("property")}
              />
              <FieldError error={formik.errors.property} touched={formik.touched.property} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="expectedPrice">Expected Price (₹)</FormLabel>
              <Input
                id="expectedPrice"
                name="expectedPrice"
                type="number"
                placeholder="e.g. 15000000"
                value={formik.values.expectedPrice || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("expectedPrice")}
              />
              <FieldError error={formik.errors.expectedPrice} touched={formik.touched.expectedPrice} submitCount={formik.submitCount} />
            </div>
            
            <div className="col-span-2">
              <FormLabel htmlFor="sellingReason">Selling Reason</FormLabel>
              <Input
                id="sellingReason"
                name="sellingReason"
                placeholder="e.g. Relocating, Upgrade, Financial"
                value={formik.values.sellingReason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("sellingReason")}
              />
              <FieldError error={formik.errors.sellingReason} touched={formik.touched.sellingReason} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Assignment & Additional Notes</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FormLabel htmlFor="assignedAgent">Assigned Employee</FormLabel>
              <Select
                value={formik.values.assignedAgent}
                onValueChange={(val) => formik.setFieldValue("assignedAgent", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("assignedAgent"))}>
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp: any) => (
                    <SelectItem key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.assignedAgent} touched={formik.touched.assignedAgent} submitCount={formik.submitCount} />
            </div>

            <div>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Add any extra details about the seller here..."
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  inputCls("notes")
                )}
              />
              <FieldError error={formik.errors.notes} touched={formik.touched.notes} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="sticky bottom-0 bg-card border-t border-border -mx-6 px-6 py-4 mt-auto flex gap-3 justify-end z-10 shadow-lg">
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
              disabled={formik.isSubmitting || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-30"
            >
              {formik.isSubmitting || isSubmitting
                ? "Saving..."
                : sellerToEdit
                ? "Update Seller"
                : "Add Seller"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
