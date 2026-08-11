import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Calendar, IndianRupee, Tag, Info, ImageIcon, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useGetProduct } from "../hooks/useGetProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import ProductFormDrawer from "../components/ProductFormDrawer";
import type { Product, ProductFormValues } from "../types/product.types";
import { getImageUrl } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: productResponse, isLoading, error, refetch } = useGetProduct(id || null);
  const product = productResponse?.data as (Product & { _id: string }) | undefined;

  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-muted-foreground text-sm">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-full items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load product or product not found.</p>
        <Button onClick={() => navigate("/products")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "Inactive":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "Discontinued":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  const handleEditSubmit = async (values: ProductFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'files') {
        (value as File[]).forEach(file => formData.append('images', file));
      } else if (key === 'images') {
        const existingImages = (value as string[]).filter(img => !img.startsWith('blob:'));
        const hasFiles = values.files && values.files.length > 0;
        if (existingImages.length === 0 && !hasFiles) {
          formData.append('images', '[]');
        } else {
          existingImages.forEach(img => {
            formData.append('images', img);
          });
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    try {
      await updateProductMutation.mutateAsync({ id: product._id, data: formData });
      toast.success("Product updated successfully");
      setDrawerOpen(false);
      refetch();
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to update product");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(product._id);
      toast.success("Product deleted successfully");
      setShowDeleteConfirm(false);
      navigate("/products");
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to delete product");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full max-w-4xl mx-auto">
      {/* Back button and Action Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/products")}
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Button>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted cursor-pointer">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-lg">
              <DropdownMenuItem onClick={() => setDrawerOpen(true)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteConfirm(true)} className="cursor-pointer text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-center gap-3">
        {product.images && product.images.length > 0 ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.title}
            className="h-12 w-12 rounded-xl flex items-center justify-center border-2 shadow-md font-bold text-xl shrink-0"
          />
        ) : (
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-border shadow-sm">
            <Tag className="h-5 w-5" />
          </div>
        )}
        <div className="text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
            <h1 className="text-xl font-bold tracking-tight text-foreground truncate">{product.title}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${getStatusColor(product.status)}`}>
              {product.status}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{product.category} {product.subCategory && `• ${product.subCategory}`}</p>
        </div>
      </div>

      {/* Product Images Gallery */}
      {product.images && product.images.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-indigo-500" /> Product Images ({product.images.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {product.images.map((img: string, idx: number) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted group">
                <img
                  src={getImageUrl(img)}
                  alt={`product-img-${idx}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost & Stock info card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-indigo-500" /> Pricing & Inventory
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Raw Cost Price</p>
              <p className="font-semibold text-foreground mt-0.5 text-sm">₹{product.rawPrice}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sale Price</p>
              <p className="font-semibold text-foreground mt-0.5 text-sm">₹{product.salePrice}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Quantity Available</p>
              <p className="font-semibold text-foreground mt-0.5 text-sm">{product.quantity} units</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Supplier</p>
              <p
                className="font-semibold text-foreground mt-0.5 text-sm truncate"
                title={Array.isArray(product.supplier) ? product.supplier.join(", ") : product.supplier}
              >
                {Array.isArray(product.supplier) ? product.supplier.join(", ") : product.supplier}
              </p>
            </div>
          </div>
        </div>

        {/* Dates Info Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-500" /> Key Dates
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Manufacturing Date</p>
                <p className="font-semibold text-foreground mt-0.5 text-sm">
                  {product.manufacturingDate
                    ? new Date(product.manufacturingDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expiry Date</p>
                <p className="font-semibold text-foreground mt-0.5 text-sm ">
                  {product.expiryDate
                    ? new Date(product.expiryDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-500" /> Description
          </h3>
          <p className="text-foreground leading-relaxed text-sm whitespace-pre-wrap">
            {product.description || "No description available for this product."}
          </p>
        </div>
      </div>

      {/* Edit Form Drawer */}
      <ProductFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleEditSubmit}
        editProductId={product._id}
      />

      {/* Delete Confirmation Alert Dialog */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(val) => !val && !deleteProductMutation.isPending && setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isPending={deleteProductMutation.isPending}
        title="Delete Product"
        itemName={product.title}
      />
    </div>
  );
}
