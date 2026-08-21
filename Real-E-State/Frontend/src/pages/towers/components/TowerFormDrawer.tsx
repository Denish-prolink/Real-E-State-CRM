import type { AddTowerPayload, Tower } from "../types/tower.types";
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
import { towerSchema } from "../schemas/tower.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useGetTowerById } from "../hooks/useTowers";
import { useGetProjects } from "../../projects/hooks/useProjects";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AddTowerPayload) => void | Promise<void>;
  towerToEdit?: Tower | null;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: AddTowerPayload = {
  projectId: "",
  name: "",
  floors: 0,
  description: "",
};

export default function TowerFormDrawer({
  open,
  onClose,
  onSubmit,
  towerToEdit,
  isSubmitting = false,
}: Props) {
  const { data: fetchedTower, isLoading: isFetching } = useGetTowerById(
    towerToEdit?._id || ""
  );

  const { data: projects = [] } = useGetProjects();

  const formik = useFormik<AddTowerPayload>({
    initialValues: EMPTY_VALUES,
    validationSchema: towerSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.description) delete payload.description;

        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (towerToEdit) {
        const tData = fetchedTower || towerToEdit;
        const projId =
          typeof tData.projectId === "object" && tData.projectId
            ? tData.projectId._id
            : (tData.projectId as string) || "";

        formik.resetForm({
          values: {
            projectId: projId,
            name: tData.name,
            floors: tData.floors || 0,
            description: tData.description || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, towerToEdit, fetchedTower]);

  const inputCls = (field: keyof AddTowerPayload) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {towerToEdit ? "Edit Tower" : "Add Tower"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {towerToEdit
                  ? "Update the details of the tower below."
                  : "Add a new tower/block to a project."}
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

          <SectionTitle>Tower configuration</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FormLabel htmlFor="projectId" required>Project Link</FormLabel>
              <Select
                value={typeof formik.values.projectId === "string" ? formik.values.projectId : (formik.values.projectId as any)?._id || ""}
                onValueChange={(val) => formik.setFieldValue("projectId", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("projectId"))}>
                  <SelectValue placeholder="Select Project">
                    {projects.find(p => p._id === (typeof formik.values.projectId === "string" ? formik.values.projectId : (formik.values.projectId as any)?._id))?.name || "Select Project"}
                  </SelectValue>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="name" required>Tower/Block Name</FormLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Block A or Wing B"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("name")}
                />
                <FieldError error={formik.errors.name} touched={formik.touched.name} submitCount={formik.submitCount} />
              </div>

              <div>
                <FormLabel htmlFor="floors">Total Floors</FormLabel>
                <Input
                  id="floors"
                  name="floors"
                  type="number"
                  placeholder="e.g. 12"
                  value={formik.values.floors || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("floors")}
                />
                <FieldError error={formik.errors.floors} touched={formik.touched.floors} submitCount={formik.submitCount} />
              </div>
            </div>

            <div>
              <FormLabel htmlFor="description">Description</FormLabel>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Description of the tower..."
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
                : towerToEdit
                ? "Update Tower"
                : "Add Tower"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
