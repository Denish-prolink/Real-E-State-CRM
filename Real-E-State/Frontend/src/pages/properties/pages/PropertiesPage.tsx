import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import PropertyFormDrawer from "../components/PropertyFormDrawer";
import PropertyGrid from "../components/PropertyGrid";
import TablePagination from "@/components/common/TablePagination";
import {
  useGetProperties,
  useAddProperty,
  useUpdateProperty,
  useDeleteProperty,
} from "../hooks/useProperties";
import type { AddPropertyPayload, Property } from "../types/property.types";

import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 9;

export default function PropertiesPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Property | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: properties = [], isLoading, isFetching } = useGetProperties();

  const addPropertyMutation = useAddProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  const handleAddOrEdit = async (values: AddPropertyPayload) => {
    try {
      if (editTarget) {
        await updatePropertyMutation.mutateAsync({ id: editTarget._id, payload: values });
        toast.success("Property updated successfully");
      } else {
        await addPropertyMutation.mutateAsync(values);
        toast.success("Property listed successfully");
      }
      setEditTarget(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (property: Property) => {
    setEditTarget(property);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deletePropertyMutation.mutateAsync(deleteId);
        toast.success("Property deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete property");
      }
    }
  };

  // Client-side search filtering
  const filtered = properties.filter((p: Property) => {
    const term = search.toLowerCase();
    const projName = typeof p.projectId === 'object' && p.projectId ? p.projectId.name : '';
    return (
      p.title.toLowerCase().includes(term) ||
      (p.propertyType || '').toLowerCase().includes(term) ||
      (p.purpose || '').toLowerCase().includes(term) ||
      projName.toLowerCase().includes(term) ||
      (p.location?.city || '').toLowerCase().includes(term)
    );
  });

  // Client-side pagination slicing
  const total = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total properties listed</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              setEditTarget(null);
              setDrawerOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by title, project, type, purpose or city..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid view */}
      <div className="w-full overflow-hidden">
        <PropertyGrid
          properties={paginated}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={setDeleteId}
          onView={(property) => navigate(`/properties/${property._id}`)}
        />

        {/* Pagination */}
        {!isLoading && total > PAGE_SIZE && (
          <div className="mt-6">
            <TablePagination
              currentPage={currentPage}
              totalItems={total}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="properties"
            />
          </div>
        )}
      </div>

      {/* Drawer Form */}
      <PropertyFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleAddOrEdit}
        propertyToEdit={editTarget}
        isSubmitting={addPropertyMutation.isPending || updatePropertyMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deletePropertyMutation.isPending}
        title="Delete Property"
        description="Are you sure you want to permanently delete this property? This action cannot be undone."
      />
    </div>
  );
}
