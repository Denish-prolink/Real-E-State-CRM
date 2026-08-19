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
  tower: "",
  unitNumber: "",
  floor: "",
  unitType: "",
  bhk: "",
  area: undefined,
  price: undefined,
  facing: "",
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
        if (!payload.tower) delete payload.tower;
        if (!payload.floor) delete payload.floor;
        if (!payload.unitType) delete payload.unitType;
        if (!payload.bhk) delete payload.bhk;
        if (!payload.area) delete payload.area;
        if (!payload.price) delete payload.price;
        if (!payload.facing) delete payload.facing;

        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (unitToEdit) {
        const uData = fetchedUnit || unitToEdit;
        const projId =
          typeof uData.projectId === "object" && uData.projectId
            ? uData.projectId._id
            : (uData.projectId as string) || "";
        const towId = uData.towerId || "";

        formik.resetForm({
          values: {
            projectId: projId,
            towerId: towId,
            tower: uData.tower || "",
            unitNumber: uData.unitNumber,
            floor: uData.floor || "",
            unitType: uData.unitType || "",
            bhk: uData.bhk || "",
            area: uData.area || undefined,
            price: uData.price || undefined,
            facing: uData.facing || "",
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
              <FormLabel htmlFor="tower">Tower Name</FormLabel>
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
                  <SelectItem value="Hold">Hold</SelectItem>
                  <SelectItem value="Booked">Booked</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="unitType">Unit Type</FormLabel>
              <Input
                id="unitType"
                name="unitType"
                placeholder="e.g. Apartment, Shop"
                value={formik.values.unitType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("unitType")}
              />
              <FieldError error={formik.errors.unitType} touched={formik.touched.unitType} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="bhk">BHK / Config</FormLabel>
              <Input
                id="bhk"
                name="bhk"
                placeholder="e.g. 3 BHK"
                value={formik.values.bhk}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("bhk")}
              />
              <FieldError error={formik.errors.bhk} touched={formik.touched.bhk} submitCount={formik.submitCount} />
            </div>
            
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
              <FormLabel htmlFor="area">Area</FormLabel>
              <Input
                id="area"
                name="area"
                type="number"
                placeholder="e.g. 1250"
                value={formik.values.area || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("area")}
              />
              <FieldError error={formik.errors.area} touched={formik.touched.area} submitCount={formik.submitCount} />
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
              <FieldError error={formik.errors.facing} touched={formik.touched.facing} submitCount={formik.submitCount} />
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
