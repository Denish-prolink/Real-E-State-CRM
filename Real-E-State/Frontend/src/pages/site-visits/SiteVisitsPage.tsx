import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import SiteVisitFormDrawer from "./components/SiteVisitFormDrawer";
import SiteVisitTable from "./components/SiteVisitTable";
import TablePagination from "@/components/common/TablePagination";
import {
  useGetSiteVisits,
  useAddSiteVisit,
  useUpdateSiteVisit,
  useDeleteSiteVisit,
} from "./hooks/useSiteVisits";
import type { AddSiteVisitPayload, SiteVisit } from "./types/siteVisit.types";

const PAGE_SIZE = 10;

export default function SiteVisitsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SiteVisit | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: visits = [], isLoading, isFetching } = useGetSiteVisits();

  const addVisitMutation = useAddSiteVisit();
  const updateVisitMutation = useUpdateSiteVisit();
  const deleteVisitMutation = useDeleteSiteVisit();

  const handleAddOrEdit = async (values: AddSiteVisitPayload) => {
    try {
      if (editTarget) {
        await updateVisitMutation.mutateAsync({ id: editTarget._id, payload: values });
        toast.success("Site visit updated successfully");
      } else {
        await addVisitMutation.mutateAsync(values);
        toast.success("Site visit scheduled successfully");
      }
      setEditTarget(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (visit: SiteVisit) => {
    setEditTarget(visit);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteVisitMutation.mutateAsync(deleteId);
        toast.success("Site visit deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete site visit");
      }
    }
  };

  // Client-side search filtering
  const filtered = visits.filter((v: SiteVisit) => {
    const term = search.toLowerCase();
    
    const leadName = typeof v.leadId === 'object' && v.leadId 
      ? `${v.leadId.firstName} ${v.leadId.lastName}`.toLowerCase() : '';
    const buyerName = typeof v.buyerId === 'object' && v.buyerId 
      ? `${v.buyerId.firstName} ${v.buyerId.lastName}`.toLowerCase() : '';
      
    const propName = typeof v.propertyId === 'object' && v.propertyId ? v.propertyId.propertyName.toLowerCase() : '';
    const projName = typeof v.projectId === 'object' && v.projectId ? v.projectId.name.toLowerCase() : '';
    const agentName = typeof v.agentId === 'object' && v.agentId ? `${v.agentId.firstName} ${v.agentId.lastName}`.toLowerCase() : '';

    return (
      leadName.includes(term) ||
      buyerName.includes(term) ||
      propName.includes(term) ||
      projName.includes(term) ||
      agentName.includes(term) ||
      (v.status || '').toLowerCase().includes(term) ||
      (v.location || '').toLowerCase().includes(term)
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
          <h1 className="text-3xl font-bold tracking-tight">Site Visits Schedule</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} visits total</p>
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
            Schedule Visit
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
            placeholder="Search by client, property, agent..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table view */}
      <div className="w-full overflow-hidden">
        <SiteVisitTable
          visits={paginated}
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
              itemLabel="visits"
            />
          </div>
        )}
      </div>

      {/* Drawer Form */}
      <SiteVisitFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleAddOrEdit}
        visitToEdit={editTarget}
        isSubmitting={addVisitMutation.isPending || updateVisitMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteVisitMutation.isPending}
        title="Delete Site Visit"
        description="Are you sure you want to permanently delete this site visit? This action cannot be undone."
      />
    </div>
  );
}
