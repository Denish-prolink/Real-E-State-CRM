import type { AddLeadPayload, Lead } from "../types/lead.types";
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
import { leadSchema } from "../schemas/lead.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetLeadById } from "../hooks/useGetLeadById";


interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddLeadPayload) => void | Promise<void>;
  leadToEdit?: Lead | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddLeadPayload = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  source: "Other",
  status: "New",
  priority: "Medium",
  budget: undefined,
  propertyType: "",
  location: "",
  bedrooms: undefined,
  area: undefined,
  assignedAgent: "",
  expectedPurchaseDate: "",
  notes: "",
};

export default function LeadFormDrawer({
  open,
  onClose,
  onSubmit,
  leadToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedLead, isLoading: isFetching } = useGetLeadById(
    leadToEdit?._id || "",
    { enabled: open && !!leadToEdit?._id }
  );



  const formik = useFormik<AddLeadPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: leadSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        // Clean values: convert empty strings to undefined/null for database clean storage
        const payload = { ...values };
        if (!payload.lastName) delete payload.lastName;
        if (!payload.email) delete payload.email;
        if (!payload.assignedAgent) delete payload.assignedAgent;
        if (!payload.expectedPurchaseDate) delete payload.expectedPurchaseDate;
        if (!payload.notes) delete payload.notes;
        if (!payload.propertyType) delete payload.propertyType;
        if (!payload.location) delete payload.location;

        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (leadToEdit) {
        const leadData = fetchedLead || leadToEdit;
        formik.resetForm({
          values: {
            firstName: leadData.firstName,
            lastName: leadData.lastName || "",
            phone: leadData.phone,
            email: leadData.email || "",
            source: leadData.source || "Other",
            status: leadData.status || "New",
            priority: leadData.priority || "Medium",
            budget: leadData.budget || undefined,
            propertyType: leadData.propertyType || "",
            location: leadData.location || "",
            bedrooms: leadData.bedrooms || undefined,
            area: leadData.area || undefined,
            assignedAgent: leadData.assignedAgent?._id || (typeof leadData.assignedAgent === 'string' ? leadData.assignedAgent : ""),
            expectedPurchaseDate: leadData.expectedPurchaseDate ? new Date(leadData.expectedPurchaseDate).toISOString().split('T')[0] : "",
            notes: leadData.notes || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, leadToEdit, fetchedLead]);

  const inputCls = (field: keyof AddLeadPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {leadToEdit ? "Edit Lead" : "Add Lead"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {leadToEdit
                  ? "Update the details of the lead below."
                  : "Create a new lead in your CRM system."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="flex-1 px-6 pt-4 flex flex-col gap-5 relative pb-6" noValidate>
          {isFetching && (
            <div className="absolute inset-0 bg-background/50 z-20 flex items-center justify-center min-h-75">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}

          <SectionTitle>Basic Contact Info</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="firstName" required>First Name</FormLabel>
              <Input
                id="firstName"
                name="firstName"
                placeholder="e.g. Rahul"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("firstName")}
              />
              <FieldError error={formik.errors.firstName} touched={formik.touched.firstName} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                name="lastName"
                placeholder="e.g. Patel"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("lastName")}
              />
              <FieldError error={formik.errors.lastName} touched={formik.touched.lastName} submitCount={formik.submitCount} />
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
          </div>

          <SectionTitle>Lead Configuration</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="status" required>Status</FormLabel>
              <Select
                value={formik.values.status}
                onValueChange={(val) => formik.setFieldValue("status", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("status"))}>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Qualified">Qualified</SelectItem>
                  <SelectItem value="Site Visit">Site Visit</SelectItem>
                  <SelectItem value="Negotiation">Negotiation</SelectItem>
                  <SelectItem value="Converted">Converted</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="priority" required>Priority</FormLabel>
              <Select
                value={formik.values.priority}
                onValueChange={(val) => formik.setFieldValue("priority", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("priority"))}>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.priority} touched={formik.touched.priority} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="source" required>Source</FormLabel>
              <Select
                value={formik.values.source}
                onValueChange={(val) => formik.setFieldValue("source", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("source"))}>
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Cold Call">Cold Call</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.source} touched={formik.touched.source} submitCount={formik.submitCount} />
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
              <FormLabel htmlFor="location">Preferred Location</FormLabel>
              <Input
                id="location"
                name="location"
                placeholder="e.g. SG Highway, Ahmedabad"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("location")}
              />
              <FieldError error={formik.errors.location} touched={formik.touched.location} submitCount={formik.submitCount} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel htmlFor="bedrooms">Bedrooms</FormLabel>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="e.g. 3"
                  value={formik.values.bedrooms || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("bedrooms")}
                />
                <FieldError error={formik.errors.bedrooms} touched={formik.touched.bedrooms} submitCount={formik.submitCount} />
              </div>
              <div>
                <FormLabel htmlFor="area">Area (sq.ft)</FormLabel>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  placeholder="e.g. 1500"
                  value={formik.values.area || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("area")}
                />
                <FieldError error={formik.errors.area} touched={formik.touched.area} submitCount={formik.submitCount} />
              </div>
            </div>
          </div>

          <SectionTitle>Expectation</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FormLabel htmlFor="expectedPurchaseDate">Expected Purchase Date</FormLabel>
              <Input
                id="expectedPurchaseDate"
                name="expectedPurchaseDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formik.values.expectedPurchaseDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("expectedPurchaseDate")}
              />
              <FieldError error={formik.errors.expectedPurchaseDate} touched={formik.touched.expectedPurchaseDate} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Additional Notes</SectionTitle>
          <div>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Add details about lead requirements or history..."
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
                : leadToEdit
                ? "Update Lead"
                : "Add Lead"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
