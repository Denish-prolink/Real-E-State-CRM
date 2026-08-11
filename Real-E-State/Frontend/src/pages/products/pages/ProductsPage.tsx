import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductFormDrawer from "../components/ProductFormDrawer";
import type { Product, ProductFormValues } from "../types/product.types";
import { useAddProduct } from "../hooks/useAddProduct";
import { useGetProducts } from "../hooks/useGetProducts";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { toast } from "sonner";
import ProductTable from "../components/ProductTable";
import TablePagination from "@/components/common/TablePagination";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: apiResponse, isLoading, isFetching } = useGetProducts({
    page: currentPage,
    perPage: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const paginationData = apiResponse?.data as { products: (Product & { _id: string })[]; total: number; page: number } | undefined;
  const products: Product[] = (paginationData?.products || []).map((p) => ({
    ...p,
    id: p._id,
  }));
  const total = paginationData?.total || 0;
  const page = paginationData?.page || 1;

  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleAddOrEdit = async (values: ProductFormValues) => {
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
      if (editTargetId) {
        const result = await updateMutation.mutateAsync({ id: editTargetId, data: formData });
        toast.success(result.message || "Product updated successfully");
      } else {
        const result = await addMutation.mutateAsync(formData);
        toast.success(result.message || "Product created successfully");
      }
      setDrawerOpen(false);
      setEditTargetId(null);
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to submit product data");
      throw error;
    }
  };

  const handleEdit = (product: Product) => {
    setEditTargetId(product.id as string);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const result = await deleteMutation.mutateAsync(deleteId);
        toast.success(result.message || "Product deleted successfully");
        setDeleteId(null);
      } catch (error) {
        const err = error as { message?: string };
        toast.error(err.message || "Failed to delete product");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total products</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => { setEditTargetId(null); setDrawerOpen(true); }}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by product, category..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <ProductTable
            products={products}
            isLoading={isLoading || isFetching}
            onEdit={handleEdit}
            onDelete={setDeleteId}
            onView={(product) => navigate(`/products/${product.id}`)}
            startIndex={(page - 1) * PAGE_SIZE}
          />
        </div>
        {/* Server-side Pagination */}
        {!(isLoading || isFetching) && (
          <TablePagination
            currentPage={page}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="products"
          />
        )}
      </div>

      {/* Add / Edit Drawer */}
      <ProductFormDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditTargetId(null); }}
        onSubmit={handleAddOrEdit}
        editProductId={editTargetId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}
