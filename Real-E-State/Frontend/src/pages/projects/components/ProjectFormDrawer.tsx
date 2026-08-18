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
  description: "",
  startDate: "",
  endDate: "",
  status: "Planned",
  address: "",
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
        if (!payload.description) delete payload.description;
        if (!payload.startDate) delete payload.startDate;
        if (!payload.endDate) delete payload.endDate;
        if (!payload.address) delete payload.address;

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
            description: projData.description || "",
            startDate: projData.startDate ? new Date(projData.startDate).toISOString().split('T')[0] : "",
            endDate: projData.endDate ? new Date(projData.endDate).toISOString().split('T')[0] : "",
            status: projData.status || "Planned",
            address: projData.address || "",
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

          <SectionTitle>Project details</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="startDate">Start Date</FormLabel>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("startDate")}
              />
              <FieldError error={formik.errors.startDate} touched={formik.touched.startDate} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="endDate">End Date</FormLabel>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("endDate")}
              />
              <FieldError error={formik.errors.endDate} touched={formik.touched.endDate} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
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
