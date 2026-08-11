import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Phone, Trash2, MapPin, User, Shield, MoreVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetWarehouseById } from "../hooks/useGetWarehouseById";
import { useDeleteWarehouse } from "../hooks/useDeleteWarehouse";
import { useUpdateWarehouse } from "../hooks/useUpdateWarehouse";
import WarehouseFormDrawer from "../components/WarehouseFormDrawer";
import type { AddWarehousePayload } from "../types/warehouse.types";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

export default function WarehouseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: warehouse, isLoading, error, refetch } = useGetWarehouseById(id || null);

  const updateWarehouseMutation = useUpdateWarehouse();
  const deleteWarehouseMutation = useDeleteWarehouse();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
        <p className="text-muted-foreground text-sm">Loading warehouse details...</p>
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-full items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load warehouse or warehouse not found.</p>
        <Button onClick={() => navigate("/warehouses")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Warehouses
        </Button>
      </div>
    );
  }

  const handleEditSubmit = async (values: AddWarehousePayload) => {
    try {
      await updateWarehouseMutation.mutateAsync({ id: warehouse._id, payload: values });
      toast.success("Warehouse updated successfully");
      setDrawerOpen(false);
      refetch();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error.response?.data?.message || error.message || "Failed to update warehouse");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWarehouseMutation.mutateAsync(warehouse._id);
      toast.success("Warehouse deleted successfully");
      setShowDeleteConfirm(false);
      navigate("/warehouses");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error.response?.data?.message || error.message || "Failed to delete warehouse");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full max-w-4xl mx-auto">
      {/* Back button and Action Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/warehouses")}
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Warehouses
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

      {/* Main Header Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xl shrink-0 border border-indigo-100 dark:border-indigo-800">
          {getInitials(warehouse.warehouseName)}
        </div>
        <div className="text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
            <h1 className="text-xl font-bold tracking-tight text-foreground truncate">
              {warehouse.warehouseName}
            </h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
              {warehouse.warehouseType}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Warehouse Code: <span className="font-semibold text-foreground">{warehouse.warehouseCode}</span>
          </p>
        </div>
      </div>

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warehouse Details Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            General Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Manager Name</p>
                <p className="font-semibold text-foreground mt-0.5 text-sm">
                  {warehouse.manager ? `${warehouse.manager.firstName} ${warehouse.manager.lastName}` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div className="w-full pr-4">
                <p className="text-xs text-muted-foreground">Capacity Status</p>
                <div className="flex justify-between items-end mt-0.5 mb-1.5">
                  <p className="font-semibold text-foreground text-sm">
                    {warehouse.usedCapacity || 0} / {warehouse.capacity} units used
                  </p>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {Math.max(0, warehouse.capacity - (warehouse.usedCapacity || 0))} remaining
                  </p>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      ((warehouse.usedCapacity || 0) / warehouse.capacity) > 0.9 ? "bg-red-500" :
                      ((warehouse.usedCapacity || 0) / warehouse.capacity) > 0.7 ? "bg-amber-500" :
                      "bg-indigo-500"
                    }`}
                    style={{ width: `${Math.min(100, ((warehouse.usedCapacity || 0) / warehouse.capacity) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Contact Information
          </h3>
          <div className="space-y-4">
            {warehouse.manager ? (
              <>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Contact Email</p>
                    <p className="font-semibold text-foreground mt-0.5 text-sm">{warehouse.manager.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Mobile Number</p>
                    <p className="font-semibold text-foreground mt-0.5 text-sm">{warehouse.manager.mobileNo}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground italic">No contact details assigned.</p>
            )}
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-500" /> Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Address Line 1</p>
              <p className="font-semibold text-foreground mt-0.5">{warehouse.addressLine1}</p>
            </div>
            {warehouse.addressLine2 && (
              <div>
                <p className="text-xs text-muted-foreground">Address Line 2</p>
                <p className="font-semibold text-foreground mt-0.5">{warehouse.addressLine2}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">City</p>
              <p className="font-semibold text-foreground mt-0.5">{warehouse.city}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">State</p>
              <p className="font-semibold text-foreground mt-0.5">{warehouse.state}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Country</p>
              <p className="font-semibold text-foreground mt-0.5">{warehouse.country}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pincode</p>
              <p className="font-semibold text-foreground mt-0.5">{warehouse.pincode}</p>
            </div>
          </div>
        </div>  
      </div>

      {/* Edit Form Drawer */}
      <WarehouseFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleEditSubmit}
        warehouseToEdit={warehouse}
        isSubmitting={updateWarehouseMutation.isPending}
      />

      {/* Delete Confirmation Alert Dialog */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(val) => !val && !deleteWarehouseMutation.isPending && setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isPending={deleteWarehouseMutation.isPending}
        title="Delete Warehouse"
        itemName={warehouse.warehouseName}
      />
    </div>
  );
}
