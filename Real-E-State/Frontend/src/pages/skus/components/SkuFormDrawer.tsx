import { useEffect } from "react";
import { useFormik } from "formik";
import { skuSchema } from "../schemas/sku.schema";
import type { Sku, SkuFormValues, SkuUnit } from "../types/sku.types";
import { useGetSku } from "../hooks/useGetSku";
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
  onSubmit: (values: SkuFormValues) => void | Promise<void>;
  editSkuId?: string | null;
}

const EMPTY_VALUES: SkuFormValues = {
  name: "",
  unit: "",
  skuCode: "",
  description: "",
};

import { FormLabel, FieldError } from "@/components/common/FormHelpers";
import { getInputClassName } from "@/components/common/formUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function SkuFormDrawer({
  open,
  onClose,
  onSubmit,
  editSkuId,
}: Props) {
  const { data: skuResponse, isLoading: isSkuLoading } = useGetSku(editSkuId || null);
  const editSku = skuResponse?.data as Sku | undefined;

  const formik = useFormik<SkuFormValues>({
    initialValues: EMPTY_VALUES,
    validationSchema: skuSchema,
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
      if (editSkuId) {
        if (editSku) {
          formik.resetForm({
            values: {
              name: editSku.name,
              unit: editSku.unit,
              skuCode: editSku.skuCode,
              description: editSku.description || "",
            },
          });
        }
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editSkuId, editSku]);

  const inputCls = (field: keyof SkuFormValues) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  const UNITS: SkuUnit[] = ['ml', 'DOZEN', 'BOX', 'GRAMS', 'KILOGRAMS', 'METERS', 'TABLETS', 'UNITS', 'PIECES', 'PAIRS'];

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
                {editSkuId ? "Edit SKU" : "Add SKU"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {editSkuId
                  ? "Update the details of your SKU below."
                  : "Create a new SKU for your inventory system."}
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
                SKU Name
              </FormLabel>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Paracetamol 500mg"
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
              <FormLabel htmlFor="skuCode" required>
                SKU Code
              </FormLabel>
              <Input
                id="skuCode"
                name="skuCode"
                placeholder="e.g. PARA-500"
                value={formik.values.skuCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("skuCode")}
              />
              <FieldError error={formik.errors.skuCode} touched={formik.touched.skuCode} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="unit" required>
                Unit
              </FormLabel>
              <Select
                value={formik.values.unit}
                onValueChange={(val) => formik.setFieldValue("unit", val)}
              >
                <SelectTrigger className={cn("w-full h-10", inputCls("unit"))}>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.unit} touched={formik.touched.unit} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="description">
                Description
              </FormLabel>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Brief details about the SKU..."
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
              disabled={formik.isSubmitting || isSkuLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-30"
            >
              {formik.isSubmitting || isSkuLoading
                ? "Saving..."
                : editSkuId
                ? "Update SKU"
                : "Add SKU"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
