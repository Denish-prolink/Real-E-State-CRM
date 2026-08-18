import type { AddUnitPayload, Unit } from "../types/unit.types";
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
import { unitSchema } from "../schemas/unit.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetUnitById } from "../hooks/useUnits";
import { useGetProjects } from "../../projects/hooks/useProjects";
import { useGetTowers } from "../../towers/hooks/useTowers";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddUnitPayload) => void | Promise<void>;
  unitToEdit?: Unit | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddUnitPayload = {
  projectId: "",
  towerId: "",
  unitNumber: "",
  floor: "",
  size: undefined,
  price: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  status: "Available",
};

export default function UnitFormDrawer({
  open,
  onClose,
  onSubmit,
  unitToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedUnit, isLoading: isFetching } = useGetUnitById(
    unitToEdit?._id || ""
  );

  const { data: projects = [] } = useGetProjects();

  const formik = useFormik<AddUnitPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: unitSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.projectId) delete payload.projectId;
        if (!payload.towerId) delete payload.towerId;
        if (!payload.floor) delete payload.floor;
        if (!payload.size) delete payload.size;
        if (!payload.price) delete payload.price;
        if (!payload.bedrooms) delete payload.bedrooms;
        if (!payload.bathrooms) delete payload.bathrooms;

        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  // Dynamic tower loading based on selected project
  const { data: towers = [] } = useGetTowers(
    { projectId: typeof formik.values.projectId === "string" ? formik.values.projectId : (formik.values.projectId as any)?._id || undefined },
    { enabled: !!formik.values.projectId }
  );

  useEffect(() => {
    if (open) {
      if (unitToEdit) {
        const uData = fetchedUnit || unitToEdit;
        const projId =
          typeof uData.projectId === "object" && uData.projectId
            ? uData.projectId._id
            : (uData.projectId as string) || "";
        const towId =
          typeof uData.towerId === "object" && uData.towerId
            ? uData.towerId._id
            : (uData.towerId as string) || "";

        formik.resetForm({
          values: {
            projectId: projId,
            towerId: towId,
            unitNumber: uData.unitNumber,
            floor: uData.floor || "",
            size: uData.size || undefined,
            price: uData.price || undefined,
            bedrooms: uData.bedrooms || undefined,
            bathrooms: uData.bathrooms || undefined,
            status: uData.status || "Available",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, unitToEdit, fetchedUnit]);

  const inputCls = (field: keyof AddUnitPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {unitToEdit ? "Edit Unit" : "Add Unit"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {unitToEdit
                  ? "Update the details of the physical unit below."
                  : "Add a new unit to a project tower."}
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

          <SectionTitle>Location links</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="projectId">Project Link</FormLabel>
              <Select
                value={formik.values.projectId}
                onValueChange={(val) => {
                  formik.setFieldValue("projectId", val);
                  formik.setFieldValue("towerId", ""); // Reset tower if project changes
                }}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("projectId"))}>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((proj) => (
                    <SelectItem key={proj._id} value={proj._id}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.projectId} touched={formik.touched.projectId} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="towerId">Tower Link</FormLabel>
              <Select
                value={formik.values.towerId}
                onValueChange={(val) => formik.setFieldValue("towerId", val)}
                disabled={!formik.values.projectId}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("towerId"))}>
                  <SelectValue placeholder={formik.values.projectId ? "Select Tower" : "Choose Project First"} />
                </SelectTrigger>
                <SelectContent>
                  {towers.map((tower) => (
                    <SelectItem key={tower._id} value={tower._id}>
                      {tower.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.towerId} touched={formik.touched.towerId} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Unit Attributes</SectionTitle>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="unitNumber" required>Unit Number</FormLabel>
              <Input
                id="unitNumber"
                name="unitNumber"
                placeholder="e.g. 101 or A-101"
                value={formik.values.unitNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("unitNumber")}
              />
              <FieldError error={formik.errors.unitNumber} touched={formik.touched.unitNumber} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="floor">Floor</FormLabel>
              <Input
                id="floor"
                name="floor"
                placeholder="e.g. 1st or 1"
                value={formik.values.floor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("floor")}
              />
              <FieldError error={formik.errors.floor} touched={formik.touched.floor} submitCount={formik.submitCount} />
            </div>

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
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="price">Price (₹)</FormLabel>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="e.g. 4500000"
                value={formik.values.price || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("price")}
              />
              <FieldError error={formik.errors.price} touched={formik.touched.price} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="size">Size (sq.ft)</FormLabel>
              <Input
                id="size"
                name="size"
                type="number"
                placeholder="e.g. 1250"
                value={formik.values.size || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("size")}
              />
              <FieldError error={formik.errors.size} touched={formik.touched.size} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="bedrooms">Bedrooms</FormLabel>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                placeholder="e.g. 2"
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
                placeholder="e.g. 2"
                value={formik.values.bathrooms || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("bathrooms")}
              />
              <FieldError error={formik.errors.bathrooms} touched={formik.touched.bathrooms} submitCount={formik.submitCount} />
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
                : unitToEdit
                ? "Update Unit"
                : "Add Unit"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
