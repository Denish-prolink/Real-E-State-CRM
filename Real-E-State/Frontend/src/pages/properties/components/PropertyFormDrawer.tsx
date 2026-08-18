import type { AddPropertyPayload, Property } from "../types/property.types";
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
import { propertySchema } from "../schemas/property.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetPropertyById } from "../hooks/useProperties";
import { useGetProjects } from "../../projects/hooks/useProjects";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddPropertyPayload) => void | Promise<void>;
  propertyToEdit?: Property | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddPropertyPayload = {
  title: "",
  description: "",
  propertyType: "Apartment",
  purpose: "Sale",
  price: 0,
  area: 0,
  bedrooms: undefined,
  bathrooms: undefined,
  parking: undefined,
  location: {
    address: "",
    city: "",
    state: "",
    country: "",
  },
  projectId: "",
  tower: "",
  floor: "",
  unitNumber: "",
  status: "Available",
};

export default function PropertyFormDrawer({
  open,
  onClose,
  onSubmit,
  propertyToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedProperty, isLoading: isFetching } = useGetPropertyById(
    propertyToEdit?._id || ""
  );

  const { data: projects } = useGetProjects();

  const formik = useFormik<AddPropertyPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: propertySchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.description) delete payload.description;
        if (!payload.bedrooms) delete payload.bedrooms;
        if (!payload.bathrooms) delete payload.bathrooms;
        if (!payload.parking) delete payload.parking;
        if (!payload.projectId) delete payload.projectId;
        if (!payload.tower) delete payload.tower;
        if (!payload.floor) delete payload.floor;
        if (!payload.unitNumber) delete payload.unitNumber;

        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (propertyToEdit) {
        const propData = fetchedProperty || propertyToEdit;
        const projId = typeof propData.projectId === 'object' && propData.projectId
          ? propData.projectId._id
          : (propData.projectId as string) || "";

        formik.resetForm({
          values: {
            title: propData.title,
            description: propData.description || "",
            propertyType: propData.propertyType || "Apartment",
            purpose: propData.purpose || "Sale",
            price: propData.price || 0,
            area: propData.area || 0,
            bedrooms: propData.bedrooms || undefined,
            bathrooms: propData.bathrooms || undefined,
            parking: propData.parking || undefined,
            location: {
              address: propData.location?.address || "",
              city: propData.location?.city || "",
              state: propData.location?.state || "",
              country: propData.location?.country || "",
            },
            projectId: projId,
            tower: propData.tower || "",
            floor: propData.floor || "",
            unitNumber: propData.unitNumber || "",
            status: propData.status || "Available",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, propertyToEdit, fetchedProperty]);

  const inputCls = (field: string) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {propertyToEdit ? "Edit Property" : "Add Property"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {propertyToEdit
                  ? "Update property details below."
                  : "List a new property in your database."}
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

          <SectionTitle>Basic Info</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FormLabel htmlFor="title" required>Property Title</FormLabel>
              <Input
                id="title"
                name="title"
                placeholder="e.g. 3 BHK Luxury Apartment in South Bopal"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("title")}
              />
              <FieldError error={formik.errors.title} touched={formik.touched.title} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="description">Description</FormLabel>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Provide detailed description of the property features, amenities..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  inputCls("description")
                )}
              />
              <FieldError error={formik.errors.description} touched={formik.touched.description} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="propertyType" required>Property Type</FormLabel>
              <Select
                value={formik.values.propertyType}
                onValueChange={(val) => formik.setFieldValue("propertyType", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("propertyType"))}>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {['Apartment', 'Villa', 'House', 'Plot', 'Office', 'Shop', 'Warehouse', 'Land', 'Commercial'].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.propertyType} touched={formik.touched.propertyType} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="purpose" required>Purpose</FormLabel>
              <Select
                value={formik.values.purpose}
                onValueChange={(val) => formik.setFieldValue("purpose", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("purpose"))}>
                  <SelectValue placeholder="Select Purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sale">Sale</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Lease">Lease</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.purpose} touched={formik.touched.purpose} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="price" required>Price (₹)</FormLabel>
              <Input
                id="price"
                name="price"
                type="number"
                value={formik.values.price || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("price")}
              />
              <FieldError error={formik.errors.price} touched={formik.touched.price} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="area" required>Area (sq.ft)</FormLabel>
              <Input
                id="area"
                name="area"
                type="number"
                value={formik.values.area || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("area")}
              />
              <FieldError error={formik.errors.area} touched={formik.touched.area} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="bedrooms">Bedrooms</FormLabel>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formik.values.bedrooms || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("bedrooms")}
              />
              <FieldError error={formik.errors.bedrooms} touched={formik.touched.bedrooms} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="bathrooms">Bathrooms</FormLabel>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formik.values.bathrooms || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("bathrooms")}
              />
              <FieldError error={formik.errors.bathrooms} touched={formik.touched.bathrooms} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="parking">Parking</FormLabel>
              <Input
                id="parking"
                name="parking"
                type="number"
                value={formik.values.parking || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("parking")}
              />
              <FieldError error={formik.errors.parking} touched={formik.touched.parking} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Location Details</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel htmlFor="location.address">Address</FormLabel>
              <Input
                id="location.address"
                name="location.address"
                placeholder="e.g. 402 Radhe Regency"
                value={formik.values.location?.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("location.address")}
              />
              <FieldError error={(formik.errors.location as any)?.address} touched={(formik.touched.location as any)?.address} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="location.city">City</FormLabel>
              <Input
                id="location.city"
                name="location.city"
                placeholder="e.g. Ahmedabad"
                value={formik.values.location?.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("location.city")}
              />
              <FieldError error={(formik.errors.location as any)?.city} touched={(formik.touched.location as any)?.city} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="location.state">State</FormLabel>
              <Input
                id="location.state"
                name="location.state"
                placeholder="e.g. Gujarat"
                value={formik.values.location?.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("location.state")}
              />
              <FieldError error={(formik.errors.location as any)?.state} touched={(formik.touched.location as any)?.state} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Real Estate Links</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="projectId">Project Link</FormLabel>
              <Select
                value={formik.values.projectId}
                onValueChange={(val) => formik.setFieldValue("projectId", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("projectId"))}>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((proj: any) => (
                    <SelectItem key={proj._id} value={proj._id}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.projectId} touched={formik.touched.projectId} submitCount={formik.submitCount} />
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
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="tower">Tower</FormLabel>
              <Input
                id="tower"
                name="tower"
                placeholder="e.g. Tower A"
                value={formik.values.tower}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("tower")}
              />
              <FieldError error={formik.errors.tower} touched={formik.touched.tower} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="floor">Floor</FormLabel>
              <Input
                id="floor"
                name="floor"
                placeholder="e.g. 4th"
                value={formik.values.floor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("floor")}
              />
              <FieldError error={formik.errors.floor} touched={formik.touched.floor} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="unitNumber">Unit Number</FormLabel>
              <Input
                id="unitNumber"
                name="unitNumber"
                placeholder="e.g. 402"
                value={formik.values.unitNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("unitNumber")}
              />
              <FieldError error={formik.errors.unitNumber} touched={formik.touched.unitNumber} submitCount={formik.submitCount} />
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
                : propertyToEdit
                ? "Update Property"
                : "Add Property"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
