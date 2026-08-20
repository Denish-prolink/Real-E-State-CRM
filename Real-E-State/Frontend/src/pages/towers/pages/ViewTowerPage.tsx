import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, MoreVertical, Building, Layers, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetTowerById, useUpdateTower, useDeleteTower } from "../hooks/useTowers";
import TowerFormDrawer from "../components/TowerFormDrawer";
import type { AddTowerPayload } from "../types/tower.types";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

export default function ViewTowerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: tower, isLoading, error, refetch } = useGetTowerById(id || "");
  const updateTowerMutation = useUpdateTower();
  const deleteTowerMutation = useDeleteTower();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-muted-foreground text-sm">Loading tower details...</p>
      </div>
    );
  }

  if (error || !tower) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-full items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load tower or tower not found.</p>
        <Button onClick={() => navigate("/towers")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Towers
        </Button>
      </div>
    );
  }

  const handleEditSubmit = async (values: AddTowerPayload) => {
    try {
      await updateTowerMutation.mutateAsync({ id: tower._id, payload: values });
      toast.success("Tower updated successfully");
      setDrawerOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update tower");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTowerMutation.mutateAsync(tower._id);
      toast.success("Tower deleted successfully");
      setShowDeleteConfirm(false);
      navigate("/towers");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete tower");
    }
  };

  const projectName = typeof tower.projectId === 'object' && tower.projectId
    ? tower.projectId.name
    : 'Unknown Project';

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full max-w-5xl mx-auto">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/towers")}
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Towers
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

      {/* Main Profile Header Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
              Tower
            </span>
            {tower.projectId ? (
              <Link to={`/projects/${typeof tower.projectId === 'object' ? tower.projectId._id : tower.projectId}`}>
                <span className="inline-flex items-center px-2.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 rounded-full font-semibold text-xs border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 cursor-pointer transition-colors">
                  Project: {projectName}
                </span>
              </Link>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 rounded-full font-semibold text-xs border border-indigo-200 dark:border-indigo-900">
                Project: {projectName}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Building className="h-7 w-7 text-indigo-500" />
            {tower.name}
          </h1>
        </div>
        
        <div className="shrink-0 flex flex-col items-start md:items-end bg-muted/30 p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground font-medium mb-1">Total Floors</p>
          <div className="flex items-center text-3xl font-black text-foreground">
            {tower.floors || 0}
          </div>
        </div>
      </div>

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 gap-6">
        {/* Specifications */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Tower Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Layers className="h-4 w-4 text-indigo-500" /> Total Floors
              </div>
              <p className="font-medium text-foreground">
                {tower.floors || 'Not Specified'}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Building className="h-4 w-4 text-indigo-500" /> Tower Name
              </div>
              <p className="font-medium text-foreground">
                {tower.name}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            About This Tower
          </h3>
          {tower.description ? (
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {tower.description}
            </p>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground italic text-sm">
              <Info className="h-4 w-4" />
              No description provided.
            </div>
          )}
        </div>
      </div>

      {/* Drawer Form */}
      <TowerFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleEditSubmit}
        towerToEdit={tower}
        isSubmitting={updateTowerMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        isPending={deleteTowerMutation.isPending}
        title="Delete Tower"
        description="Are you sure you want to delete this tower? This action cannot be undone."
      />
    </div>
  );
}
