import type { Supplier, SupplierFormValues } from "../types/supplier.types";
import {
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import SupplierFormDrawer from "../components/SupplierFormDrawer";
import SupplierGrid from "../components/SupplierGrid";
import { toast } from "sonner";
import { useAddSupplier } from "../hooks/useAddSupplier";
import { useDeleteSupplier } from "../hooks/useDeleteSupplier";
import { useGetSuppliers } from "../hooks/useGetSuppliers";
import { useUpdateSupplier } from "../hooks/useUpdateSupplier";
import TablePagination from "@/components/common/TablePagination";
import { useDebounce } from "@/hooks/useDebounce";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

const PAGE_SIZE = 10;

export default function SuppliersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: apiResponse, isLoading, isFetching } = useGetSuppliers({
    page: currentPage,
    perPage: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const paginationData = apiResponse?.data as { suppliers: Supplier[]; total: number; page: number } | undefined;
  const suppliers: Supplier[] = paginationData?.suppliers || [];
  const total = paginationData?.total || 0;
  const page = paginationData?.page || 1;

  const addMutation = useAddSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  const handleAddOrEdit = async (values: SupplierFormValues) => {
    if (editTargetId) {
      try {
        const result = await updateMutation.mutateAsync({
          id: editTargetId,
          data: values,
        });
        toast.success(result.message || "Supplier updated successfully");
        setEditTargetId(null);
        setDrawerOpen(false);
      } catch (error) {
        const err = error as { message?: string };
        toast.error(err.message || "Failed to update supplier");
        throw error;
      }
    } else {
      try {
        const result = await addMutation.mutateAsync(values);
        toast.success(result.message || "Supplier created successfully");
        setEditTargetId(null);
        setDrawerOpen(false);
      } catch (error) {
        const err = error as { message?: string };
        toast.error(err.message || "Failed to add supplier");
        throw error;
      }
    }
  };

  const openEdit = (supplier: Supplier) => {
    setEditTargetId(supplier._id);
    setDrawerOpen(true);
  };

  const confirmDelete = (id: string) => setDeleteId(id);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const result = await deleteMutation.mutateAsync(deleteId);
        toast.success(result.message || "Supplier deleted successfully");
        setDeleteId(null);
      } catch (error) {
        const err = error as { message?: string };
        toast.error(err.message || "Failed to delete supplier");
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supplier Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {total} total suppliers
          </p>
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
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-3 items-center bg-card border border-border rounded-xl px-4 py-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by supplier code, name, email or mobile..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="w-full">
        <SupplierGrid
          suppliers={suppliers}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={confirmDelete}
        />
      </div>

      {/* Server-side Pagination */}
      {!(isLoading || isFetching) && (
        <TablePagination
          currentPage={page}
          totalItems={total}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          itemLabel="suppliers"
        />
      )}

      {/* Drawer */}
      <SupplierFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTargetId(null);
        }}
        onSubmit={handleAddOrEdit}
        editSupplierId={editTargetId}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && !deleteMutation.isPending && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Delete Supplier"
        description="Are you sure you want to permanently delete this supplier? This action cannot be undone and the record will be removed from the database."
      />
    </div>
  );
}
