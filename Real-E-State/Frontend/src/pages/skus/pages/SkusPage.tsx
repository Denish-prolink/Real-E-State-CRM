import type { Sku, SkuFormValues } from "../types/sku.types";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkuFormDrawer from "../components/SkuFormDrawer";
import SkuGrid from "../components/SkuGrid";
import TablePagination from "@/components/common/TablePagination";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { useAddSku } from "../hooks/useAddSku";
import { useDeleteSku } from "../hooks/useDeleteSku";
import { useGetSkus } from "../hooks/useGetSkus";
import { useState } from "react";
import { useUpdateSku } from "../hooks/useUpdateSku";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

export default function SkusPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: apiResponse, isLoading, isFetching } = useGetSkus({
    page: currentPage,
    perPage: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const data = apiResponse?.data as { skus: Sku[]; total: number; page: number } | undefined;
  const skus: Sku[] = data?.skus || [];
  const total = data?.total || 0;
  const page = data?.page || 1;

  const addMutation = useAddSku();
  const updateMutation = useUpdateSku();
  const deleteMutation = useDeleteSku();

  const handleAddOrEdit = async (values: SkuFormValues) => {
    try {
      if (editTargetId) {
        const result = await updateMutation.mutateAsync({ id: editTargetId, data: values });
        toast.success(result.message || "SKU updated successfully");
      } else {
        const result = await addMutation.mutateAsync(values);
        toast.success(result.message || "SKU created successfully");
      }
      setEditTargetId(null);
      setDrawerOpen(false);
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to submit SKU data");
      throw error;
    }
  };

  const openEdit = (sku: Sku) => {
    setEditTargetId(sku._id);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const result = await deleteMutation.mutateAsync(deleteId);
        toast.success(result.message || "SKU deleted successfully");
        setDeleteId(null);
      } catch (error) {
        const err = error as { message?: string };
        toast.error(err.message || "Failed to delete SKU");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SKU Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total SKUs</p>
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
            Add SKU
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
            placeholder="Search by SKU name, code or description..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <SkuGrid
            skus={skus}
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
            itemLabel="SKUs"
          />
        )}
      </div>

      {/* Drawer */}
      <SkuFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTargetId(null);
        }}
        onSubmit={handleAddOrEdit}
        editSkuId={editTargetId}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Delete SKU"
        description="Are you sure you want to permanently delete this SKU? This action cannot be undone."
      />
    </div>
  );
}
