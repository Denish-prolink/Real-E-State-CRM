import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import WarehouseFormDrawer from "../components/WarehouseFormDrawer";
import WarehouseTable from "../components/WarehouseTable";
import { useAddWarehouse } from "../hooks/useAddWarehouse";
import { useDeleteWarehouse } from "../hooks/useDeleteWarehouse";
import { useGetWarehouses } from "../hooks/useGetWarehouses";
import { useUpdateWarehouse } from "../hooks/useUpdateWarehouse";
import type { AddWarehousePayload, Warehouse } from "../types/warehouse.types";
import { useDebounce } from "@/hooks/useDebounce";

export default function WarehousesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<Warehouse | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: warehousesResponse, isLoading, isFetching } = useGetWarehouses(debouncedSearch || undefined);
  const warehouses = warehousesResponse || [];

  const addWarehouseMutation = useAddWarehouse();
  const updateWarehouseMutation = useUpdateWarehouse();
  const deleteWarehouseMutation = useDeleteWarehouse();

  const handleAddOrEdit = async (values: AddWarehousePayload) => {
    if (editTargetId) {
      try {
        await updateWarehouseMutation.mutateAsync({ id: editTargetId._id, payload: values });
        toast.success("Warehouse updated successfully");
        setEditTargetId(null);
        setDrawerOpen(false);
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(err.response?.data?.message || err.message || "Failed to update warehouse");
      }
    } else {
      try {
        await addWarehouseMutation.mutateAsync(values);
        toast.success("Warehouse created successfully");
        setEditTargetId(null);
        setDrawerOpen(false);
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(err.response?.data?.message || err.message || "Failed to add warehouse");
      }
    }
  };

  const openEdit = (warehouse: Warehouse) => {
    setEditTargetId(warehouse);
    setDrawerOpen(true);
  };

  const confirmDelete = (id: string) => setDeleteId(id);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteWarehouseMutation.mutateAsync(deleteId);
        toast.success("Warehouse deleted successfully");
        setDeleteId(null);
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(err.response?.data?.message || err.message || "Failed to delete warehouse");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {warehouses.length} total warehouses
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
            Add Warehouse
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code , type , manager..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <WarehouseTable
          warehouses={warehouses}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={confirmDelete}
          onView={(warehouse) => navigate(`/warehouses/${warehouse._id}`)}
        />
      </div>

      {/* Drawer */}
      <WarehouseFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTargetId(null);
        }}
        onSubmit={handleAddOrEdit}
        warehouseToEdit={editTargetId}
        isSubmitting={addWarehouseMutation.isPending || updateWarehouseMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && !deleteWarehouseMutation.isPending && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteWarehouseMutation.isPending}
        title="Delete Warehouse"
        description="Are you sure you want to permanently delete this warehouse? This action cannot be undone and the record will be removed from the database."
      />
    </div>
  );
}
