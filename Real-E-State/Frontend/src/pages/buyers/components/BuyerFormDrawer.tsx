import type { BuyerFormValues, Buyer } from "../types/buyer.types";
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
import { buyerSchema } from "../schemas/buyer.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetEmployees } from "../../employees/hooks/useGetEmployees";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: BuyerFormValues) => void | Promise<void>;
  buyerToEdit?: Buyer | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: BuyerFormValues = {
  name: "",
  phone: "",
  email: "",
  budget: undefined,
  propertyType: "",
  preferredLocation: "",
  purpose: "",
  assignedAgent: "",
  requirements: "",
  status: "New",
  notes: "",
};

export default function BuyerFormDrawer({
  open,
  onClose,
  onSubmit,
  buyerToEdit,
  isSubmitting = false,
}: Props) {
  const { data: employeesData } = useGetEmployees();
  const employees = employeesData || [];

  const formik = useFormik<BuyerFormValues>({
    initialValues: EMPTY_VALUES,
    validationSchema: buyerSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.email) delete payload.email;
        if (!payload.assignedAgent) delete payload.assignedAgent;
        if (!payload.notes) delete payload.notes;
        if (!payload.propertyType) delete payload.propertyType;
        if (!payload.preferredLocation) delete payload.preferredLocation;
        if (!payload.purpose) delete payload.purpose;
        if (!payload.requirements) delete payload.requirements;

        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (buyerToEdit) {
        formik.resetForm({
          values: {
            name: buyerToEdit.name,
            phone: buyerToEdit.phone,
            email: buyerToEdit.email || "",
            budget: buyerToEdit.budget || undefined,
            propertyType: buyerToEdit.propertyType || "",
            preferredLocation: buyerToEdit.preferredLocation || "",
            purpose: buyerToEdit.purpose || "",
            assignedAgent: buyerToEdit.assignedAgent || "",
            requirements: buyerToEdit.requirements || "",
            status: buyerToEdit.status || "New",
            notes: buyerToEdit.notes || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, buyerToEdit]);

  const inputCls = (field: keyof BuyerFormValues) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {buyerToEdit ? "Edit Buyer" : "Add Buyer"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {buyerToEdit
                  ? "Update the details of the buyer below."
                  : "Create a new buyer profile in your CRM system."}
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

          <SectionTitle>Requirements & Preferences</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="propertyType">Property Type</FormLabel>
              <Select
                value={formik.values.propertyType}
                onValueChange={(val) => formik.setFieldValue("propertyType", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("propertyType"))}>
                  <SelectValue placeholder="Select Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Plot">Plot</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Shop">Shop</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.propertyType} touched={formik.touched.propertyType} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="budget">Budget (₹)</FormLabel>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="e.g. 5000000"
                value={formik.values.budget || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("budget")}
              />
              <FieldError error={formik.errors.budget} touched={formik.touched.budget} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="preferredLocation">Preferred Location</FormLabel>
              <Input
                id="preferredLocation"
                name="preferredLocation"
                placeholder="e.g. SG Highway, Ahmedabad"
                value={formik.values.preferredLocation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("preferredLocation")}
              />
              <FieldError error={formik.errors.preferredLocation} touched={formik.touched.preferredLocation} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="purpose">Purpose</FormLabel>
              <Select
                value={formik.values.purpose}
                onValueChange={(val) => formik.setFieldValue("purpose", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("purpose"))}>
                  <SelectValue placeholder="Select Purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Rental">Rental</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.purpose} touched={formik.touched.purpose} submitCount={formik.submitCount} />
            </div>
            
            <div className="col-span-2">
              <FormLabel htmlFor="requirements">Specific Requirements</FormLabel>
              <Input
                id="requirements"
                name="requirements"
                placeholder="e.g. Needs a balcony, Vastu compliant"
                value={formik.values.requirements}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("requirements")}
              />
              <FieldError error={formik.errors.requirements} touched={formik.touched.requirements} submitCount={formik.submitCount} />
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
                placeholder="Add any extra details about the buyer here..."
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
                : buyerToEdit
                ? "Update Buyer"
                : "Add Buyer"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
