import { useEffect } from "react";
import { useFormik } from "formik";
import { productSchema } from "../schemas/product.schema";
import type { Product, ProductFormValues } from "../types/product.types";
import type { Category } from "../../categories/types/category.types";
import type { Contact } from "../../contacts/types/contact.types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, getImageUrl } from "@/lib/utils";
import { X, ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import { useGetCategories } from "../../categories/hooks/useGetCategories";
import { useGetContacts } from "../../contacts/hooks/useGetContacts";
import { useGetProduct } from "../hooks/useGetProduct";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  editProductId?: string | null;
}

const EMPTY_VALUES: ProductFormValues = {
  title: "",
  description: "",
  manufacturingDate: "",
  expiryDate: "",
  quantity: 0,
  rawPrice: 0,
  // rawPrice: 0,
  salePrice: 0,
  category: "",
  subCategory: "",
  status: "Active",
  images: [],
  files: [],
  supplier: [],
};



import { FormLabel, SectionTitle, FieldError } from "@/components/common/FormHelpers";
import { getInputClassName } from "@/components/common/formUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function ProductFormDrawer({
  open,
  onClose,
  onSubmit,
  editProductId,
}: Props) {
  const isUploading = false;
  const { data: categoriesResponse } = useGetCategories({}, open);
  const categoriesData = categoriesResponse?.data as { categories: Category[] } | undefined;
  const categories = categoriesData?.categories || [];
  
  const { data: contactsResponse } = useGetContacts({}, { enabled: open });
  const contactsData = contactsResponse as { contacts: Contact[] } | undefined;
  const allContacts = contactsData?.contacts || [];
  const suppliers = allContacts.filter((c: { type: string; name: string; _id: string }) => ['supplier', 'vendor', 'seller'].includes(c.type));
  
  const { data: productResponse, isLoading: isProductLoading } = useGetProduct(editProductId || null);
  const editProduct = productResponse?.data as (Product & { _id: string }) | undefined;

  const formik = useFormik<ProductFormValues>({
    initialValues: EMPTY_VALUES,
    validationSchema: productSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      console.log("Submitting form with values:", values);
      try {
        await onSubmit(values);
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  // Reset / pre-fill form when drawer opens or product data loads
  useEffect(() => {
    if (open) {
      if (editProductId) {
        if (editProduct) {
          const p = editProduct;
          formik.resetForm({
            values: {
              title: p.title || "",
              description: p.description || "",
              manufacturingDate: p.manufacturingDate ? new Date(p.manufacturingDate).toISOString().split("T")[0] : "",
              expiryDate: p.expiryDate ? new Date(p.expiryDate).toISOString().split("T")[0] : "",
              quantity: p.quantity || 0,
              rawPrice: p.rawPrice || 0,
              salePrice: p.salePrice || 0,
              category: p.category || "",
              subCategory: p.subCategory || "",
              status: p.status || "Active",
              images: p.images || [],
              files: [],
              supplier: Array.isArray(p.supplier)
                ? p.supplier
                : typeof p.supplier === "string"
                ? p.supplier.split(",").map((s) => s.trim()).filter(Boolean)
                : [],
            }
          });
        }
      } else {
        formik.resetForm({ values: EMPTY_VALUES });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editProductId, editProduct]);



  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    const newObjectUrls = newFiles.map(file => URL.createObjectURL(file));
    formik.setFieldValue("files", [...(formik.values.files || []), ...newFiles]);
    formik.setFieldValue("images", [...formik.values.images, ...newObjectUrls]);
    
    // reset file input
    e.target.value = "";
  };



  const removeImage = (idx: number) => {
    const imageToRemove = formik.values.images[idx];
    
    formik.setFieldValue(
      "images",
      formik.values.images.filter((_, i) => i !== idx)
    );
    
    if (imageToRemove.startsWith('blob:') && formik.values.files) {
      // Find the file that matches this blob (approximate by index of blob URLs)
      const blobUrls = formik.values.images.filter(img => img.startsWith('blob:'));
      const blobIndex = blobUrls.indexOf(imageToRemove);
      if (blobIndex !== -1) {
        formik.setFieldValue(
          "files",
          formik.values.files.filter((_, i) => i !== blobIndex)
        );
      }
    }
  };

  const inputCls = (name: string) => getInputClassName(
    formik.errors,
    formik.touched,
    formik.submitCount,
    name,
    "h-9 w-full rounded-lg border px-3 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors",
    "border-red-400 bg-red-50/30"
  );


  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col"
      >
        {/* Sticky Header */}
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-semibold">
                {editProductId ? "Edit Product" : "Add New Product"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                {editProductId
                  ? "Update the product details below."
                  : "Fill in the details to add a product to your inventory."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Form Body */}
        <form
          onSubmit={formik.handleSubmit}
          className="flex-1 px-6 pt-4 flex flex-col gap-5"
          noValidate
        >
          {/* ── BASIC INFO ── */}
          <SectionTitle>Basic Information</SectionTitle>
          <div className="flex flex-col gap-4">
            {/* Title */}
            <div>
              <FormLabel htmlFor="title" required>
                Product Title
              </FormLabel>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Wireless Keyboard K270"
                value={formik.values.title}
                onChange={(e) => {
                  formik.handleChange(e);
                  const val = e.target.value;
                  if (val.length >= 50) {
                    formik.setFieldTouched("title", true, true);
                  } else {
                    formik.setFieldTouched("title", false, false);
                  }
                }}
                onBlur={formik.handleBlur}
                className={inputCls("title")}
              />
              <FieldError error={formik.errors.title} touched={formik.touched.title} submitCount={formik.submitCount} />
            </div>

            {/* Description */}
            <div>
              <FormLabel htmlFor="description">Description</FormLabel>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Product description..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors"
              />
              <FieldError error={formik.errors.description} touched={formik.touched.description} submitCount={formik.submitCount} />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <FormLabel htmlFor="supplier" required>
                  Suppliers
                </FormLabel>
                <DropdownMenu
                  onOpenChange={(open) => {
                    if (!open) {
                      formik.setFieldTouched("supplier", true, true);
                    }
                  }}
                >
                  <DropdownMenuTrigger
                    className={cn(
                      "flex h-9 w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-sm bg-background shadow-sm hover:bg-muted/30 transition-colors cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                      (formik.errors.supplier && (formik.touched.supplier || formik.submitCount > 0)) && "border-red-400 bg-red-50/30"
                    )}
                  >
                    <span className="truncate pr-4">
                      {Array.isArray(formik.values.supplier) && formik.values.supplier.length > 0
                        ? formik.values.supplier.join(", ")
                        : "Select suppliers"}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">▼</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--anchor-width] min-w-56 max-h-56 overflow-y-auto">
                    {suppliers.length === 0 ? (
                      <div className="text-xs text-muted-foreground text-center py-2">No suppliers found</div>
                    ) : (
                      suppliers.map((s: { _id: string; name: string }) => {
                        const selectedSuppliers = Array.isArray(formik.values.supplier)
                          ? formik.values.supplier
                          : typeof formik.values.supplier === "string"
                          ? (formik.values.supplier as string).split(",").map((val) => val.trim()).filter(Boolean)
                          : [];
                        const isChecked = selectedSuppliers.includes(s.name);

                        return (
                          <DropdownMenuCheckboxItem
                            key={s._id}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              let updated: string[];
                              if (checked) {
                                updated = [...selectedSuppliers, s.name];
                              } else {
                                updated = selectedSuppliers.filter((name) => name !== s.name);
                              }
                              formik.setFieldValue("supplier", updated, true);
                            }}
                          >
                            <span className="truncate">{s.name}</span>
                          </DropdownMenuCheckboxItem>
                        );
                      })
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FieldError error={formik.errors.supplier} touched={formik.touched.supplier} submitCount={formik.submitCount} />
              </div>
            </div>
          </div>

          {/* ── DATES ── */}
          <SectionTitle>Dates</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormLabel htmlFor="manufacturingDate" required>
                Manufacturing Date
              </FormLabel>
              <input
                type="date"
                id="manufacturingDate"
                name="manufacturingDate"
                value={formik.values.manufacturingDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("manufacturingDate")}
              />
              <FieldError error={formik.errors.manufacturingDate} touched={formik.touched.manufacturingDate} submitCount={formik.submitCount} />
            </div>
            <div>
              <FormLabel htmlFor="expiryDate">Expiry Date</FormLabel>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formik.values.expiryDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("expiryDate")}
              />
              <FieldError error={formik.errors.expiryDate} touched={formik.touched.expiryDate} submitCount={formik.submitCount} />
            </div>
          </div>

          {/* ── PRICING ── */}
          <SectionTitle>Pricing</SectionTitle>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="rawPrice" required>
                  Raw / Cost Price (₹)
                </FormLabel>
                <Input
                  id="rawPrice"
                  name="rawPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  value={formik.values.rawPrice !== undefined && formik.values.rawPrice !== null ? formik.values.rawPrice : ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("rawPrice")}
                />
                <FieldError error={formik.errors.rawPrice} touched={formik.touched.rawPrice} submitCount={formik.submitCount} />
              </div>
              <div>
                <FormLabel htmlFor="salePrice" required>
                  Sale Price (₹)
                </FormLabel>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  value={formik.values.salePrice !== undefined && formik.values.salePrice !== null ? formik.values.salePrice : ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={inputCls("salePrice")}
                />
                <FieldError error={formik.errors.salePrice} touched={formik.touched.salePrice} submitCount={formik.submitCount} />
              </div>
            </div>
          </div>

          {/* ── STOCK & CLASSIFICATION ── */}
          <SectionTitle>Stock & Classification</SectionTitle>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {editProductId && (
                <div>
                  <FormLabel htmlFor="quantity">
                    Quantity Available
                  </FormLabel>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formik.values.quantity || 0}
                    disabled
                    className="h-9 w-full rounded-lg border px-3 text-sm bg-muted/50 text-muted-foreground border-border cursor-not-allowed"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Quantity is updated automatically through orders.</p>
                </div>
              )}
              <div>
                <FormLabel htmlFor="status" required>
                  Status
                </FormLabel>
                <Select
                  value={formik.values.status}
                  onValueChange={(val) => formik.setFieldValue("status", val)}
                >
                  <SelectTrigger className={cn("w-full h-9", inputCls("status"))}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError error={formik.errors.status} touched={formik.touched.status} submitCount={formik.submitCount} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel htmlFor="category" required>
                  Category
                </FormLabel>
                <Select
                  value={formik.values.category}
                  onValueChange={(val) => {
                    formik.setFieldValue("category", val, true);
                    formik.setFieldValue("subCategory", "", false);
                  }}
                >
                  <SelectTrigger className={cn("w-full h-9", inputCls("category"))}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c: { _id: string; name: string }) => (
                      <SelectItem key={c._id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError error={formik.errors.category} touched={formik.touched.category} submitCount={formik.submitCount} />
              </div>
              <div>
                <FormLabel htmlFor="subCategory">Subcategory</FormLabel>
                <Input
                  id="subCategory"
                  name="subCategory"
                  placeholder="e.g. Mobile, Laptop"
                  value={formik.values.subCategory}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.category}
                  className={inputCls("subCategory")}
                />
              </div>
            </div>
          </div>

          {/* ── IMAGES ── */}
          <SectionTitle>Product Images</SectionTitle>
          <div className="flex flex-col gap-3">
            {formik.values.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {formik.values.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-muted"
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`product-${idx}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10 animate-fade-in"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                      <ImageIcon className="h-5 w-5 text-white drop-shadow" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              />
              <div className={cn("w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/10 py-6 transition-colors", !isUploading && "group-hover:bg-muted/30 group-hover:border-indigo-300")}>
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center mb-2 shadow-sm border border-border">
                  {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-indigo-500" /> : <UploadCloud className="h-5 w-5 text-muted-foreground group-hover:text-indigo-500 transition-colors" />}
                </div>
                <span className="text-xs font-medium text-foreground mb-0.5">
                  {isUploading ? "Uploading..." : "Click or drag to upload multiple images"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  PNG, JPG or JPEG (max. 5MB per file)
                </span>
              </div>
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div className="sticky bottom-0 z-20 bg-card border-t border-border -mx-6 px-6 py-4 mt-auto flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => { formik.resetForm(); onClose(); }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || isProductLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-30"
            >
              {formik.isSubmitting || isProductLoading
                ? "Saving..."
                : editProductId
                ? "Update Product"
                : "Add Product"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
