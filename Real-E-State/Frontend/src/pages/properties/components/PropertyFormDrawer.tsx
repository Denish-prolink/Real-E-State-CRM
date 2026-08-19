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

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddPropertyPayload) => void | Promise<void>;
  propertyToEdit?: Property | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddPropertyPayload = {
  propertyName: "",
  propertyId: "",
  propertyType: "Apartment",
  category: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  latitude: undefined,
  longitude: undefined,
  price: 0,
  area: 0,
  areaUnit: "sq.ft",
  bedrooms: undefined,
  bathrooms: undefined,
  parking: undefined,
  furnishedStatus: "",
  constructionStatus: "",
  ownership: "",
  facing: "",
  description: "",
  amenities: [],
  images: [],
  documents: [],
  agentId: "",
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

  const formik = useFormik<AddPropertyPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: propertySchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        // Cleanup empty strings for optional numbers
        if (payload.latitude === "" as any) delete payload.latitude;
        if (payload.longitude === "" as any) delete payload.longitude;
        if (payload.bedrooms === "" as any) delete payload.bedrooms;
        if (payload.bathrooms === "" as any) delete payload.bathrooms;
        if (payload.parking === "" as any) delete payload.parking;

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
        formik.resetForm({
          values: {
            propertyName: propData.propertyName,
            propertyId: propData.propertyId || "",
            propertyType: propData.propertyType || "Apartment",
            category: propData.category || "",
            address: propData.address || "",
            city: propData.city || "",
            state: propData.state || "",
            country: propData.country || "",
            pincode: propData.pincode || "",
            latitude: propData.latitude,
            longitude: propData.longitude,
            price: propData.price || 0,
            area: propData.area || 0,
            areaUnit: propData.areaUnit || "sq.ft",
            bedrooms: propData.bedrooms,
            bathrooms: propData.bathrooms,
            parking: propData.parking,
            furnishedStatus: propData.furnishedStatus || "",
            constructionStatus: propData.constructionStatus || "",
            ownership: propData.ownership || "",
            facing: propData.facing || "",
            description: propData.description || "",
            amenities: propData.amenities || [],
            images: propData.images || [],
            documents: propData.documents || [],
            agentId: propData.agentId || "",
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel htmlFor="propertyName" required>Property Name</FormLabel>
              <Input
                id="propertyName"
                name="propertyName"
                placeholder="e.g. 3 BHK Luxury Apartment in South Bopal"
                value={formik.values.propertyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("propertyName")}
              />
              <FieldError error={formik.errors.propertyName} touched={formik.touched.propertyName} submitCount={formik.submitCount} />
            </div>
            
            <div>
              <FormLabel htmlFor="propertyId">Property Code/ID</FormLabel>
              <Input
                id="propertyId"
                name="propertyId"
                placeholder="e.g. PROP-001"
                value={formik.values.propertyId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("propertyId")}
              />
              <FieldError error={formik.errors.propertyId} touched={formik.touched.propertyId} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="category">Category</FormLabel>
              <Input
                id="category"
                name="category"
                placeholder="e.g. Premium"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("category")}
              />
              <FieldError error={formik.errors.category} touched={formik.touched.category} submitCount={formik.submitCount} />
            </div>
            
            <div className="col-span-2">
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

          <SectionTitle>Classification & Pricing</SectionTitle>
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
              <FormLabel htmlFor="area" required>Area</FormLabel>
              <div className="flex gap-2">
                 <Input
                  id="area"
                  name="area"
                  type="number"
                  value={formik.values.area || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn("flex-1", inputCls("area"))}
                />
                <Input
                  id="areaUnit"
                  name="areaUnit"
                  placeholder="Unit"
                  value={formik.values.areaUnit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn("w-24", inputCls("areaUnit"))}
                />
              </div>
              <FieldError error={formik.errors.area} touched={formik.touched.area} submitCount={formik.submitCount} />
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
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Rented">Rented</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Location Details</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel htmlFor="address">Address</FormLabel>
              <Input
                id="address"
                name="address"
                placeholder="e.g. 402 Radhe Regency"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("address")}
              />
              <FieldError error={formik.errors.address} touched={formik.touched.address} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="city">City</FormLabel>
              <Input
                id="city"
                name="city"
                placeholder="e.g. Ahmedabad"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("city")}
              />
              <FieldError error={formik.errors.city} touched={formik.touched.city} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="state">State</FormLabel>
              <Input
                id="state"
                name="state"
                placeholder="e.g. Gujarat"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("state")}
              />
              <FieldError error={formik.errors.state} touched={formik.touched.state} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Features & Attributes</SectionTitle>
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
            
            <div>
              <FormLabel htmlFor="furnishedStatus">Furnishing</FormLabel>
              <Select
                value={formik.values.furnishedStatus}
                onValueChange={(val) => formik.setFieldValue("furnishedStatus", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("furnishedStatus"))}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                  <SelectItem value="Semi-Furnished">Semi-Furnished</SelectItem>
                  <SelectItem value="Fully-Furnished">Fully-Furnished</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <FormLabel htmlFor="constructionStatus">Construction</FormLabel>
              <Select
                value={formik.values.constructionStatus}
                onValueChange={(val) => formik.setFieldValue("constructionStatus", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("constructionStatus"))}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                  <SelectItem value="Under Construction">Under Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <FormLabel htmlFor="facing">Facing</FormLabel>
              <Input
                id="facing"
                name="facing"
                placeholder="e.g. East"
                value={formik.values.facing}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("facing")}
              />
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
