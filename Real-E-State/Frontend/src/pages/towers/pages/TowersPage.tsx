import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import TowerFormDrawer from "../components/TowerFormDrawer";
import TowerTable from "../components/TowerTable";
import TablePagination from "@/components/common/TablePagination";
import {
  useGetTowers,
  useAddTower,
  useUpdateTower,
  useDeleteTower,
} from "../hooks/useTowers";
import { useGetProjects } from "../../projects/hooks/useProjects";
import type { AddTowerPayload, Tower } from "../types/tower.types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 10;

export default function TowersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [projectIdFilter, setProjectIdFilter] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tower | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch projects for dropdown filtering
  const { data: projects = [] } = useGetProjects();

  // Fetch towers based on projectId query param
  const { data: towers = [], isLoading, isFetching } = useGetTowers({
    projectId: projectIdFilter !== "all" ? projectIdFilter : undefined,
  });

  const addTowerMutation = useAddTower();
  const updateTowerMutation = useUpdateTower();
  const deleteTowerMutation = useDeleteTower();

  const handleAddOrEdit = async (values: AddTowerPayload) => {
    try {
      if (editTarget) {
        await updateTowerMutation.mutateAsync({ id: editTarget._id, payload: values });
        toast.success("Tower updated successfully");
      } else {
        await addTowerMutation.mutateAsync(values);
        toast.success("Tower created successfully");
      }
      setEditTarget(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (tower: Tower) => {
    setEditTarget(tower);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteTowerMutation.mutateAsync(deleteId);
        toast.success("Tower deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete tower");
      }
    }
  };

  // Client-side search filtering
  const filtered = towers.filter((t: Tower) => {
    const term = search.toLowerCase();
    const projName = typeof t.projectId === 'object' && t.projectId ? t.projectId.name : '';
    return (
      t.name.toLowerCase().includes(term) ||
      projName.toLowerCase().includes(term) ||
      (t.description || '').toLowerCase().includes(term)
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
          <h1 className="text-3xl font-bold tracking-tight">Project Towers</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} towers total</p>
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
            Add Tower
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
            placeholder="Search towers by name or project..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="w-[180px]">
          <Select
            value={projectIdFilter}
            onValueChange={(val) => { setProjectIdFilter(val || "all"); setCurrentPage(1); }}
          >
            <SelectTrigger className="w-full h-9 border-border bg-card">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((proj) => (
                <SelectItem key={proj._id} value={proj._id}>
                  {proj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table view */}
      <div className="w-full overflow-hidden">
        <TowerTable
          towers={paginated}
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
              itemLabel="towers"
            />
          </div>
        )}
      </div>

      {/* Drawer Form */}
      <TowerFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleAddOrEdit}
        towerToEdit={editTarget}
        isSubmitting={addTowerMutation.isPending || updateTowerMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteTowerMutation.isPending}
        title="Delete Tower"
        description="Are you sure you want to permanently delete this tower? This action cannot be undone."
      />
    </div>
  );
}
