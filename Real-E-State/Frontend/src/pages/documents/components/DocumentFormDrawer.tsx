import { useEffect } from "react";
import { useFormik } from "formik";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, FormLabel, SectionTitle } from "@/components/common/FormHelpers";
import { getInputClassName } from "@/components/common/formUtils";
import { documentSchema } from "../schemas/document.schema";
import { useDocumentById } from "@/hooks/useDocuments";
import type { DocumentData } from "@/hooks/useDocuments";

interface DocumentFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: DocumentData) => void | Promise<void>;
  documentToEdit?: DocumentData | null;
  isSubmitting?: boolean;
  defaultRelatedType?: string;
  defaultRelatedId?: string;
}

const EMPTY_VALUES: DocumentData = {
  title: "",
  description: "",
  fileUrl: "",
  fileType: "",
  relatedType: "",
  relatedId: "",
};

export default function DocumentFormDrawer({
  open,
  onClose,
  onSubmit,
  documentToEdit,
  isSubmitting = false,
  defaultRelatedType,
  defaultRelatedId,
}: DocumentFormDrawerProps) {
  const { data: fetchedDocument, isLoading: isFetching } = useDocumentById(
    documentToEdit?._id || "",
  );

  const formik = useFormik<DocumentData>({
    initialValues: {
      ...EMPTY_VALUES,
      relatedType: defaultRelatedType || "",
      relatedId: defaultRelatedId || "",
    },
    validationSchema: documentSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        const payload = { ...values };
        if (!payload.description) delete payload.description;
        if (!payload.fileType) delete payload.fileType;
        if (!payload.relatedType) delete payload.relatedType;
        if (!payload.relatedId) delete payload.relatedId;

        await onSubmit(payload);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (documentToEdit) {
        const docData = fetchedDocument || documentToEdit;
        formik.resetForm({
          values: {
            title: docData.title,
            description: docData.description || "",
            fileUrl: docData.fileUrl,
            fileType: docData.fileType || "",
            relatedType: docData.relatedType || "",
            relatedId: docData.relatedId || "",
          },
        });
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
  }, [open, documentToEdit, fetchedDocument]);

  const inputCls = (field: keyof DocumentData) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {documentToEdit ? "Edit Document" : "Add Document"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {documentToEdit
                  ? "Update the details of the document below."
                  : "Upload or link a new document in your CRM."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="flex-1 px-6 pt-4 flex flex-col gap-5 relative pb-6" noValidate>
          {isFetching && (
            <div className="absolute inset-0 bg-background/50 z-20 flex items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}

          <SectionTitle>Document Details</SectionTitle>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FormLabel htmlFor="title" required>Title</FormLabel>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Property Brochure"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("title")}
              />
              <FieldError error={formik.errors.title} touched={formik.touched.title} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="fileUrl" required>File URL</FormLabel>
              <Input
                id="fileUrl"
                name="fileUrl"
                placeholder="https://example.com/document.pdf"
                value={formik.values.fileUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("fileUrl")}
              />
              <FieldError error={formik.errors.fileUrl} touched={formik.touched.fileUrl} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input
                id="description"
                name="description"
                placeholder="Brief description of the document"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("description")}
              />
              <FieldError error={formik.errors.description} touched={formik.touched.description} submitCount={formik.submitCount} />
            </div>
          </div>

          <SectionTitle>Associations</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="relatedType">Related To</FormLabel>
              <Input
                id="relatedType"
                name="relatedType"
                placeholder="e.g. Lead, Property"
                value={formik.values.relatedType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("relatedType")}
              />
              <FieldError error={formik.errors.relatedType} touched={formik.touched.relatedType} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="relatedId">Related ID</FormLabel>
              <Input
                id="relatedId"
                name="relatedId"
                placeholder="ID of the related record"
                value={formik.values.relatedId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("relatedId")}
              />
              <FieldError error={formik.errors.relatedId} touched={formik.touched.relatedId} submitCount={formik.submitCount} />
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
            >
              {formik.isSubmitting || isSubmitting
                ? "Saving..."
                : documentToEdit
                ? "Update Document"
                : "Add Document"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
