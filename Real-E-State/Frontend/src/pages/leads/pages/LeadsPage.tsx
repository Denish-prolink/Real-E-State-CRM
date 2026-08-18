import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import LeadFormDrawer from "../components/LeadFormDrawer";
import LeadGrid from "../components/LeadGrid";
import TablePagination from "@/components/common/TablePagination";
import { useAddLead } from "../hooks/useAddLead";
import { useDeleteLead } from "../hooks/useDeleteLead";
import { useGetLeads } from "../hooks/useGetLeads";
import { useUpdateLead } from "../hooks/useUpdateLead";
import type { AddLeadPayload, Lead } from "../types/lead.types";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 12;

export default function LeadsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: apiResponse, isLoading, isFetching } = useGetLeads({
    page: currentPage,
    perPage: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const leads: Lead[] = apiResponse?.leads || [];
  const total = apiResponse?.total || 0;
  const page = apiResponse?.page || 1;

  const addLeadMutation = useAddLead();
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  const handleAddOrEdit = async (values: AddLeadPayload) => {
    try {
      if (editTargetId) {
        await updateLeadMutation.mutateAsync({ id: editTargetId._id, payload: values });
        toast.success("Lead updated successfully");
      } else {
        await addLeadMutation.mutateAsync(values);
        toast.success("Lead created successfully");
      }
      setEditTargetId(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (lead: Lead) => {
    setEditTargetId(lead);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteLeadMutation.mutateAsync(deleteId);
        toast.success("Lead deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete lead");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total leads</p>
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
            Add Lead
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
        <LeadGrid
          leads={leads}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={setDeleteId}
          onView={(lead) => navigate(`/leads/${lead._id}`)}
        />

        {/* Server-side Pagination */}
        {!(isLoading || isFetching) && (
          <div className="mt-4">
            <TablePagination
              currentPage={page}
              totalItems={total}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="leads"
            />
          </div>
        )}
      </div>

      {/* Drawer */}
      <LeadFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTargetId(null);
        }}
        onSubmit={handleAddOrEdit}
        leadToEdit={editTargetId}
        isSubmitting={addLeadMutation.isPending || updateLeadMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteLeadMutation.isPending}
        title="Delete Lead"
        description="Are you sure you want to permanently delete this lead? This action cannot be undone."
      />
    </div>
  );
}
