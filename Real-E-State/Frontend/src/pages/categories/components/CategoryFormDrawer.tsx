import { useEffect } from "react";
import { useFormik } from "formik";
import { categorySchema } from "../schemas/category.schema";
import type { Category, CategoryFormValues } from "../types/category.types";
import { useGetCategory } from "../hooks/useGetCategory";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => void | Promise<void>;
  editCategoryId?: string | null;
}

const EMPTY_VALUES: CategoryFormValues = {
  name: "",
  description: "",
};

import { FormLabel, FieldError } from "@/components/common/FormHelpers";
import { getInputClassName } from "@/components/common/formUtils";

export default function CategoryFormDrawer({
  open,
  onClose,
  onSubmit,
  editCategoryId,
}: Props) {
  const { data: categoryResponse, isLoading: isCategoryLoading } = useGetCategory(editCategoryId || null);
  const editCategory = categoryResponse?.data as Category | undefined;

  const formik = useFormik<CategoryFormValues>({
    initialValues: EMPTY_VALUES,
    validationSchema: categorySchema,
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
      if (editCategoryId) {
        if (editCategory) {
          formik.resetForm({
            values: {
              name: editCategory.name,
              description: editCategory.description || "",
            },
          });
        }
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editCategoryId, editCategory]);

  const inputCls = (field: keyof CategoryFormValues) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col"
      >
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {editCategoryId ? "Edit Category" : "Add Category"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {editCategoryId
                  ? "Update the details of your category below."
                  : "Create a new category for your Real-E-State CRM system."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="flex-1 px-6 pt-4 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-4">
            <div>
              <FormLabel htmlFor="name" required>
                Category Name
              </FormLabel>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Electronics, Office Supplies"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("name")}
              />
              <FieldError error={formik.errors.name} touched={formik.touched.name} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="description">
                Description
              </FormLabel>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Brief details about the category..."
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
              disabled={formik.isSubmitting || isCategoryLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
            >
              {formik.isSubmitting || isCategoryLoading
                ? "Saving..."
                : editCategoryId
                  ? "Update Category"
                  : "Add Category"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
