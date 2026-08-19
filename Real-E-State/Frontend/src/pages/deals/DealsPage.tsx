import { useState } from "react";
import { Plus, Search, IndianRupee, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import DealFormDrawer from "./components/DealFormDrawer";
import {
  useGetDeals,
  useAddDeal,
  useUpdateDeal,
  useDeleteDeal,
} from "./hooks/useDeals";
import type { AddDealPayload, Deal } from "./types/deal.types";

export default function DealsPage() {
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Deal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: deals = [], isLoading } = useGetDeals();

  const addDealMutation = useAddDeal();
  const updateDealMutation = useUpdateDeal();
  const deleteDealMutation = useDeleteDeal();

  const handleAddOrEdit = async (values: AddDealPayload) => {
    try {
      if (editTarget) {
        await updateDealMutation.mutateAsync({ id: editTarget._id, payload: values });
        toast.success("Deal updated successfully");
      } else {
        await addDealMutation.mutateAsync(values);
        toast.success("Deal created successfully");
      }
      setEditTarget(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (deal: Deal) => {
    setEditTarget(deal);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteDealMutation.mutateAsync(deleteId);
        toast.success("Deal deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete deal");
      }
    }
  };

  // Client-side search filtering
  const filteredDeals = deals.filter((deal: Deal) => {
    const term = search.toLowerCase();
    
    const leadName = typeof deal.leadId === 'object' && deal.leadId 
      ? `${deal.leadId.firstName} ${deal.leadId.lastName}`.toLowerCase() : '';
    
    const dealNum = deal.dealId?.toLowerCase() || '';

    return (
      leadName.includes(term) ||
      dealNum.includes(term) ||
      deal.status.toLowerCase().includes(term)
    );
  });

  const stages = ['Lead', 'Qualified', 'Site Visit', 'Negotiation', 'Booking', 'Agreement', 'Closed', 'Lost'];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Deals Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{filteredDeals.length} deals total</p>
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
            Create Deal
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by lead or deal ID..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Pipeline Board View */}
      <div className="flex overflow-x-auto gap-4 pb-4 min-h-[500px]">
        {stages.map((stage) => {
          const stageDeals = filteredDeals.filter((d) => d.status === stage);
          const stageTotalValue = stageDeals.reduce((sum, d) => sum + (d.dealAmount || 0), 0);
          
          return (
            <div key={stage} className="bg-muted/30 border border-border rounded-xl min-w-[280px] flex flex-col">
              <div className="p-3 border-b border-border bg-muted/50 rounded-t-xl sticky top-0 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{stage}</h3>
                  {stageTotalValue > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium flex items-center">
                       <IndianRupee className="h-2.5 w-2.5" />
                       {stageTotalValue.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
                <span className="text-xs font-bold px-2 py-0.5 bg-background border border-border text-foreground rounded-full shadow-sm">
                  {stageDeals.length}
                </span>
              </div>
              
              <div className="flex-1 p-2 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)]">
                {stageDeals.map((deal) => {
                   const leadName = typeof deal.leadId === 'object' && deal.leadId 
                     ? `${deal.leadId.firstName} ${deal.leadId.lastName}`
                     : '-';
                     
                   return (
                     <div key={deal._id} className="bg-card p-3 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow group relative">
                       <div className="flex justify-between items-start mb-1">
                         <p className="font-bold text-sm text-foreground">{deal.dealId || 'DEAL'}</p>
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => openEdit(deal)} className="p-1 text-muted-foreground hover:text-indigo-600 rounded">
                             <Edit2 className="h-3 w-3" />
                           </button>
                           <button onClick={() => setDeleteId(deal._id)} className="p-1 text-muted-foreground hover:text-red-600 rounded">
                             <Trash2 className="h-3 w-3" />
                           </button>
                         </div>
                       </div>
                       
                       <p className="text-xs text-muted-foreground font-medium mb-2">
                         {leadName}
                       </p>
                       
                       <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                         <p className="text-sm font-extrabold text-indigo-600 flex items-center gap-0.5">
                           <IndianRupee className="h-3.5 w-3.5" />
                           {deal.dealAmount?.toLocaleString('en-IN')}
                         </p>
                         {deal.expectedClosingDate && (
                           <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                             {new Date(deal.expectedClosingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                           </span>
                         )}
                       </div>
                     </div>
                   );
                })}
                
                {stageDeals.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground/50">
                    Drop deals here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer Form */}
      <DealFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleAddOrEdit}
        dealToEdit={editTarget}
        isSubmitting={addDealMutation.isPending || updateDealMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteDealMutation.isPending}
        title="Delete Deal"
        description="Are you sure you want to permanently delete this deal? This action cannot be undone."
      />
    </div>
  );
}
