import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import SellerFormDrawer from "../components/SellerFormDrawer";
import SellerGrid from "../components/SellerGrid";
import TablePagination from "@/components/common/TablePagination";
import { useDeleteSeller } from "../hooks/useDeleteSeller";
import { useGetSellers } from "../hooks/useGetSellers";
import type { SellerFormValues, Seller } from "../types/seller.types";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 12;

export default function SellersPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<Seller | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: apiResponse, isLoading, isFetching } = useGetSellers({
    page: currentPage,
    perPage: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const sellers: Seller[] = apiResponse?.data?.sellers || apiResponse?.sellers || [];
  const total = apiResponse?.data?.total || apiResponse?.total || 0;
  const page = apiResponse?.data?.page || apiResponse?.page || 1;

  const deleteSellerMutation = useDeleteSeller();

  const isAddingOrUpdating = false;

  const handleAddOrEdit = async (_values: SellerFormValues) => {
    try {
      if (editTargetId) {
        toast.success("Seller updated successfully (dummy)");
      } else {
        toast.success("Seller created successfully (dummy)");
      }
      setEditTargetId(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (seller: Seller) => {
    setEditTargetId(seller);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteSellerMutation.mutateAsync(deleteId);
        toast.success("Seller deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete seller");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sellers Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total sellers</p>
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
            Add Seller
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
        <SellerGrid
          sellers={sellers}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={setDeleteId}
          onView={(seller) => navigate(`/sellers/${seller._id}`)}
        />

        {/* Server-side Pagination */}
        {!(isLoading || isFetching) && (
          <div className="mt-4">
            <TablePagination
              currentPage={page}
              totalItems={total}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="sellers"
            />
          </div>
        )}
      </div>

      {/* Drawer */}
      <SellerFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTargetId(null);
        }}
        onSubmit={handleAddOrEdit}
        sellerToEdit={editTargetId}
        isSubmitting={isAddingOrUpdating}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteSellerMutation.isPending}
        title="Delete Seller"
        description="Are you sure you want to permanently delete this seller? This action cannot be undone."
      />
    </div>
  );
}
