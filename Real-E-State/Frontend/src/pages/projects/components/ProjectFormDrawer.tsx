import type { AddProjectPayload, Project } from "../types/project.types";
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
import { projectSchema } from "../schemas/project.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetProjectById } from "../hooks/useProjects";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddProjectPayload) => void | Promise<void>;
  projectToEdit?: Project | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddProjectPayload = {
  name: "",
  projectCode: "",
  developer: "",
  location: "",
  address: "",
  city: "",
  state: "",
  projectType: "",
  totalTowers: undefined,
  totalUnits: undefined,
  availableUnits: undefined,
  amenities: [],
  reraNumber: "",
  possessionDate: "",
  startingPrice: undefined,
  description: "",
  status: "Planned",
};

export default function ProjectFormDrawer({
  open,
  onClose,
  onSubmit,
  projectToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedProject, isLoading: isFetching } = useGetProjectById(
    projectToEdit?._id || ""
  );

  const formik = useFormik<AddProjectPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: projectSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        // Cleanup empty strings for optional numbers and dates
        if (payload.totalTowers === "" as any) delete payload.totalTowers;
        if (payload.totalUnits === "" as any) delete payload.totalUnits;
        if (payload.availableUnits === "" as any) delete payload.availableUnits;
        if (payload.startingPrice === "" as any) delete payload.startingPrice;
        if (!payload.possessionDate) delete payload.possessionDate;
        
        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (projectToEdit) {
        const projData = fetchedProject || projectToEdit;
        formik.resetForm({
          values: {
            name: projData.name,
            projectCode: projData.projectCode || "",
            developer: projData.developer || "",
            location: projData.location || "",
            address: projData.address || "",
            city: projData.city || "",
            state: projData.state || "",
            projectType: projData.projectType || "",
            totalTowers: projData.totalTowers,
            totalUnits: projData.totalUnits,
            availableUnits: projData.availableUnits,
            amenities: projData.amenities || [],
            reraNumber: projData.reraNumber || "",
            possessionDate: projData.possessionDate ? new Date(projData.possessionDate).toISOString().split('T')[0] : "",
            startingPrice: projData.startingPrice,
            description: projData.description || "",
            status: projData.status || "Planned",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, projectToEdit, fetchedProject]);

  const inputCls = (field: keyof AddProjectPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {projectToEdit ? "Edit Project" : "Add Project"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {projectToEdit
                  ? "Update the details of the project below."
                  : "Create a new project entry."}
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

          <SectionTitle>Basic Project details</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="name" required>Project Name</FormLabel>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Shaligram Prime"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("name")}
              />
              <FieldError error={formik.errors.name} touched={formik.touched.name} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="projectCode">Project Code</FormLabel>
              <Input
                id="projectCode"
                name="projectCode"
                placeholder="e.g. PRJ-001"
                value={formik.values.projectCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("projectCode")}
              />
              <FieldError error={formik.errors.projectCode} touched={formik.touched.projectCode} submitCount={formik.submitCount} />
            </div>
            
            <div>
              <FormLabel htmlFor="developer">Developer/Builder</FormLabel>
              <Input
                id="developer"
                name="developer"
                placeholder="e.g. Shaligram Group"
                value={formik.values.developer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("developer")}
              />
              <FieldError error={formik.errors.developer} touched={formik.touched.developer} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="projectType">Project Type</FormLabel>
              <Select
                value={formik.values.projectType}
                onValueChange={(val) => formik.setFieldValue("projectType", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("projectType"))}>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Plotting">Plotting</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.projectType} touched={formik.touched.projectType} submitCount={formik.submitCount} />
            </div>

            <div className="col-span-2">
              <FormLabel htmlFor="description">Description</FormLabel>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Residential luxury apartments with smart features..."
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

          <SectionTitle>Location Details</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
              <FormLabel htmlFor="address">Project Address</FormLabel>
              <Input
                id="address"
                name="address"
                placeholder="e.g. South Bopal, Ahmedabad"
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

          <SectionTitle>Units & Pricing</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="totalTowers">Total Towers</FormLabel>
              <Input
                id="totalTowers"
                name="totalTowers"
                type="number"
                placeholder="e.g. 5"
                value={formik.values.totalTowers || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("totalTowers")}
              />
              <FieldError error={formik.errors.totalTowers} touched={formik.touched.totalTowers} submitCount={formik.submitCount} />
            </div>
            
            <div>
              <FormLabel htmlFor="totalUnits">Total Units</FormLabel>
              <Input
                id="totalUnits"
                name="totalUnits"
                type="number"
                placeholder="e.g. 200"
                value={formik.values.totalUnits || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("totalUnits")}
              />
              <FieldError error={formik.errors.totalUnits} touched={formik.touched.totalUnits} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="availableUnits">Available Units</FormLabel>
              <Input
                id="availableUnits"
                name="availableUnits"
                type="number"
                placeholder="e.g. 45"
                value={formik.values.availableUnits || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("availableUnits")}
              />
              <FieldError error={formik.errors.availableUnits} touched={formik.touched.availableUnits} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="startingPrice">Starting Price (₹)</FormLabel>
              <Input
                id="startingPrice"
                name="startingPrice"
                type="number"
                placeholder="e.g. 5000000"
                value={formik.values.startingPrice || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("startingPrice")}
              />
              <FieldError error={formik.errors.startingPrice} touched={formik.touched.startingPrice} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Status & Compliance</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <FormLabel htmlFor="reraNumber">RERA Number</FormLabel>
              <Input
                id="reraNumber"
                name="reraNumber"
                placeholder="e.g. PR/GJ/AHMEDABAD/..."
                value={formik.values.reraNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("reraNumber")}
              />
              <FieldError error={formik.errors.reraNumber} touched={formik.touched.reraNumber} submitCount={formik.submitCount} />
            </div>
            
            <div>
              <FormLabel htmlFor="possessionDate">Possession Date</FormLabel>
              <Input
                id="possessionDate"
                name="possessionDate"
                type="date"
                value={formik.values.possessionDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("possessionDate")}
              />
              <FieldError error={formik.errors.possessionDate} touched={formik.touched.possessionDate} submitCount={formik.submitCount} />
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
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
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
                : projectToEdit
                ? "Update Project"
                : "Add Project"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
