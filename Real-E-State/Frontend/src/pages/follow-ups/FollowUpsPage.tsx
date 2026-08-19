import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import FollowUpFormDrawer from "./components/FollowUpFormDrawer";
import FollowUpTable from "./components/FollowUpTable";
import TablePagination from "@/components/common/TablePagination";
import {
  useGetFollowUps,
  useAddFollowUp,
  useUpdateFollowUp,
  useDeleteFollowUp,
} from "./hooks/useFollowUps";
import type { AddFollowUpPayload, FollowUp } from "./types/followUp.types";

const PAGE_SIZE = 10;

export default function FollowUpsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FollowUp | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: followUps = [], isLoading, isFetching } = useGetFollowUps();

  const addFuMutation = useAddFollowUp();
  const updateFuMutation = useUpdateFollowUp();
  const deleteFuMutation = useDeleteFollowUp();

  const handleAddOrEdit = async (values: AddFollowUpPayload) => {
    try {
      if (editTarget) {
        await updateFuMutation.mutateAsync({ id: editTarget._id, payload: values });
        toast.success("Follow-up updated successfully");
      } else {
        await addFuMutation.mutateAsync(values);
        toast.success("Follow-up scheduled successfully");
      }
      setEditTarget(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (fu: FollowUp) => {
    setEditTarget(fu);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteFuMutation.mutateAsync(deleteId);
        toast.success("Follow-up deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete follow-up");
      }
    }
  };

  // Client-side search filtering
  const filtered = followUps.filter((fu: FollowUp) => {
    const term = search.toLowerCase();
    
    const leadName = typeof fu.leadId === 'object' && fu.leadId 
      ? `${fu.leadId.firstName} ${fu.leadId.lastName}`.toLowerCase() : '';
    const buyerName = typeof fu.customerId === 'object' && fu.customerId 
      ? `${fu.customerId.firstName} ${fu.customerId.lastName}`.toLowerCase() : '';
      
    const agentName = typeof fu.agentId === 'object' && fu.agentId ? `${fu.agentId.firstName} ${fu.agentId.lastName}`.toLowerCase() : '';

    return (
      leadName.includes(term) ||
      buyerName.includes(term) ||
      agentName.includes(term) ||
      (fu.status || '').toLowerCase().includes(term) ||
      (fu.followUpType || '').toLowerCase().includes(term)
    );
  });

  // Client-side pagination slicing
  const total = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Follow-Ups</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} follow-ups scheduled</p>
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
            Add Follow-Up
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by client, agent or type..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table view */}
      <div className="w-full overflow-hidden">
        <FollowUpTable
          followUps={paginated}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={setDeleteId}
          startIndex={startIndex}
        />

        {/* Pagination */}
        {!isLoading && total > PAGE_SIZE && (
          <div className="mt-4">
            <TablePagination
              currentPage={currentPage}
              totalItems={total}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="follow-ups"
            />
          </div>
        )}
      </div>

      {/* Drawer Form */}
      <FollowUpFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleAddOrEdit}
        followUpToEdit={editTarget}
        isSubmitting={addFuMutation.isPending || updateFuMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteFuMutation.isPending}
        title="Delete Follow-Up"
        description="Are you sure you want to permanently delete this follow-up? This action cannot be undone."
      />
    </div>
  );
}
