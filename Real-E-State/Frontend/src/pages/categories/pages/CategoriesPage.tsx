import type { Category, CategoryFormValues } from "../types/category.types";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryFormDrawer from "../components/CategoryFormDrawer";
import CategoryGrid from "../components/CategoryGrid";
import TablePagination from "@/components/common/TablePagination";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { useAddCategory } from "../hooks/useAddCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useGetCategories } from "../hooks/useGetCategories";
import { useState } from "react";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 12;

export default function CategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: apiResponse, isLoading, isFetching } = useGetCategories({
    page: currentPage,
    perPage: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const data = apiResponse?.data as { categories: Category[]; total: number; page: number } | undefined;
  const categories = data?.categories || [];
  const total = data?.total || 0;
  const page = data?.page || 1;

  const addMutation = useAddCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleAddOrEdit = async (values: CategoryFormValues) => {
    try {
      if (editTargetId) {
        const result = await updateMutation.mutateAsync({ id: editTargetId, data: values });
        toast.success(result.message || "Category updated successfully");
      } else {
        const result = await addMutation.mutateAsync(values);
        toast.success(result.message || "Category created successfully");
      }
      setEditTargetId(null);
      setDrawerOpen(false);
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to update/create category");
      throw error;
    }
  };

  const openEdit = (category: Category) => {
    setEditTargetId(category._id);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const result = await deleteMutation.mutateAsync(deleteId);
        toast.success(result.message || "Category deleted successfully");
        setDeleteId(null);
      } catch (error) {
        const err = error as { message?: string };
        toast.error(err.message || "Failed to delete category");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total categories</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              setEditTargetId(null);
              setDrawerOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by category name or description..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <CategoryGrid
            categories={categories}
            isLoading={isLoading || isFetching}
            onEdit={openEdit}
            onDelete={setDeleteId}
          />
        </div>

        {/* Server-side Pagination */}
        {!(isLoading || isFetching) && (
          <TablePagination
            currentPage={page}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            itemLabel="categories"
          />
        )}
      </div>

      {/* Drawer */}
      <CategoryFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTargetId(null);
        }}
        onSubmit={handleAddOrEdit}
        editCategoryId={editTargetId}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Delete Category"
        description="Are you sure you want to permanently delete this category? This action cannot be undone."
      />
    </div>
  );
}
