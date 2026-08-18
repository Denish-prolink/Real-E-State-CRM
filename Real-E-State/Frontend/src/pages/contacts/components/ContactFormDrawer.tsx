import type { AddContactPayload, Contact } from "../types/contact.types";
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
import { contactSchema } from "../schemas/contact.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetContactById } from "../hooks/useGetContactById";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddContactPayload) => void | Promise<void>;
  contactToEdit?: Contact | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddContactPayload = {
  name: "",
  type: "customer",
  email: "",
  mobileNo: "",
  gender: "",
  dob: "",
  address: "",
  notes: "",
};





export default function ContactFormDrawer({
  open,
  onClose,
  onSubmit,
  contactToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedContact, isLoading: isFetching } = useGetContactById(
    contactToEdit?._id || "",
    { enabled: open && !!contactToEdit?._id }
  );

  const formik = useFormik<AddContactPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: contactSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        await onSubmit(values);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (contactToEdit) {
        const contactData = fetchedContact || contactToEdit;
        formik.resetForm({
          values: {
            name: contactData.name,
            type: contactData.type,
            email: contactData.email,
            mobileNo: contactData.mobileNo,
            gender: contactData.gender || "",
            dob: contactData.dob ? new Date(contactData.dob).toISOString().split('T')[0] : "",
            address: contactData.address || "",
            notes: contactData.notes || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, contactToEdit, fetchedContact]);

  const inputCls = (field: keyof AddContactPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {contactToEdit ? "Edit Contact" : "Add Contact"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {contactToEdit
                  ? "Update the details of the contact below."
                  : "Create a new contact in your system."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="flex-1 px-6 pt-4 flex flex-col gap-5 relative" noValidate>
          {isFetching && (
            <div className="absolute inset-0 bg-background/50 z-20 flex items-center justify-center min-h-75">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}
          <SectionTitle>Basic Information</SectionTitle>
          <div className="flex flex-col gap-4">
            <div>
              <FormLabel htmlFor="name" required>Name</FormLabel>
              <Input
                id="name"
                name="name"
                placeholder="e.g. John Doe or Acme Corp"
                value={formik.values.name}
                onChange={(e) => {
                  formik.handleChange(e);
                  const val = e.target.value;
                  if (val.length >= 50) {
                    formik.setFieldTouched("name", true, true);
                  } else {
                    formik.setFieldTouched("name", false, false);
                  }
                }}
                onBlur={formik.handleBlur}
                className={inputCls("name")}
              />
              <FieldError error={formik.errors.name} touched={formik.touched.name} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="type" required>Contact Type</FormLabel>
              <Select
                value={formik.values.type}
                onValueChange={(val) => formik.setFieldValue("type", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("type"))}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buyer">Buyer</SelectItem>
                  <SelectItem value="Seller">Seller</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.type} touched={formik.touched.type} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Contact Details</SectionTitle>
          <div className="flex flex-col gap-4">
            <div>
              <FormLabel htmlFor="mobileNo" required>Mobile Number</FormLabel>
              <Input
                id="mobileNo"
                name="mobileNo"
                placeholder="e.g. 9876543210"
                value={formik.values.mobileNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("mobileNo")}
              />
              <FieldError error={formik.errors.mobileNo} touched={formik.touched.mobileNo} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="email" required>Email Address</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. contact@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("email")}
              />
              <FieldError error={formik.errors.email} touched={formik.touched.email} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Additional Details</SectionTitle>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <FormLabel htmlFor="gender" required>Gender</FormLabel>
                <Select
                  value={formik.values.gender}
                  onValueChange={(val) => formik.setFieldValue("gender", val)}
                >
                  <SelectTrigger className={cn("w-full h-9", inputCls("gender"))}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError error={formik.errors.gender} touched={formik.touched.gender} submitCount={formik.submitCount} />
              </div>

              <div className="flex-1">
                <FormLabel htmlFor="dob">Date of Birth</FormLabel>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  max={new Date().toLocaleDateString('en-CA')}
                  value={formik.values.dob}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("dob")}
                />
                <FieldError error={formik.errors.dob} touched={formik.touched.dob} submitCount={formik.submitCount} />
              </div>
            </div>

            <div>
              <FormLabel htmlFor="address">Address</FormLabel>
              <textarea
                id="address"
                name="address"
                rows={2}
                placeholder="Enter address..."
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  inputCls("address")
                )}
              />
              <FieldError error={formik.errors.address} touched={formik.touched.address} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="notes">Notes and Comments</FormLabel>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Add any additional notes here..."
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
              disabled={formik.isSubmitting || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-30"
            >
              {formik.isSubmitting || isSubmitting
                ? "Saving..."
                : contactToEdit
                  ? "Update Contact"
                  : "Add Contact"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
