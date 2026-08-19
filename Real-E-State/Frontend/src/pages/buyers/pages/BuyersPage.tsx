import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import BuyerFormDrawer from "../components/BuyerFormDrawer";
import BuyerGrid from "../components/BuyerGrid";
import TablePagination from "@/components/common/TablePagination";
import { useDeleteBuyer } from "../hooks/useDeleteBuyer";
import { useGetBuyers } from "../hooks/useGetBuyers";
import type { BuyerFormValues, Buyer } from "../types/buyer.types";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 12;

export default function BuyersPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<Buyer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: apiResponse, isLoading, isFetching } = useGetBuyers({
    page: currentPage,
    perPage: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  // Extract buyers based on API response structure. Assuming the format is similar to Leads.
  const buyers: Buyer[] = apiResponse?.data?.buyers || apiResponse?.buyers || [];
  const total = apiResponse?.data?.total || apiResponse?.total || 0;
  const page = apiResponse?.data?.page || apiResponse?.page || 1;

  const deleteBuyerMutation = useDeleteBuyer();

  // Assuming you will create useAddBuyer and useUpdateBuyer hooks later. 
  // For now, these are dummy implementations waiting for hook creation.
  const isAddingOrUpdating = false;

  const handleAddOrEdit = async (_values: BuyerFormValues) => {
    try {
      if (editTargetId) {
        // await updateBuyerMutation.mutateAsync({ id: editTargetId._id, payload: values });
        toast.success("Buyer updated successfully (dummy)");
      } else {
        // await addBuyerMutation.mutateAsync(values);
        toast.success("Buyer created successfully (dummy)");
      }
      setEditTargetId(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (buyer: Buyer) => {
    setEditTargetId(buyer);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteBuyerMutation.mutateAsync(deleteId);
        toast.success("Buyer deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete buyer");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buyers Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total buyers</p>
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
            Add Buyer
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
            placeholder="Search by name, email or phone..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="w-full overflow-hidden">
        <BuyerGrid
          buyers={buyers}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={setDeleteId}
          onView={(buyer) => navigate(`/buyers/${buyer._id}`)}
        />

        {/* Server-side Pagination */}
        {!(isLoading || isFetching) && (
          <div className="mt-4">
            <TablePagination
              currentPage={page}
              totalItems={total}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="buyers"
            />
          </div>
        )}
      </div>

      {/* Drawer */}
      <BuyerFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTargetId(null);
        }}
        onSubmit={handleAddOrEdit}
        buyerToEdit={editTargetId}
        isSubmitting={isAddingOrUpdating}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteBuyerMutation.isPending}
        title="Delete Buyer"
        description="Are you sure you want to permanently delete this buyer? This action cannot be undone."
      />
    </div>
  );
}
