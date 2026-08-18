import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import UnitFormDrawer from "../components/UnitFormDrawer";
import UnitTable from "../components/UnitTable";
import TablePagination from "@/components/common/TablePagination";
import {
  useGetUnits,
  useAddUnit,
  useUpdateUnit,
  useDeleteUnit,
} from "../hooks/useUnits";
import { useGetProjects } from "../../projects/hooks/useProjects";
import { useGetTowers } from "../../towers/hooks/useTowers";
import type { AddUnitPayload, Unit } from "../types/unit.types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 10;

export default function UnitsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [projectIdFilter, setProjectIdFilter] = useState<string>("all");
  const [towerIdFilter, setTowerIdFilter] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Unit | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch projects and towers for filters
  const { data: projects = [] } = useGetProjects();
  const { data: towers = [] } = useGetTowers(
    { projectId: projectIdFilter !== "all" ? projectIdFilter : undefined },
    { enabled: projectIdFilter !== "all" }
  );

  // Fetch units based on filters
  const { data: units = [], isLoading, isFetching } = useGetUnits({
    projectId: projectIdFilter !== "all" ? projectIdFilter : undefined,
    towerId: towerIdFilter !== "all" ? towerIdFilter : undefined,
  });

  const addUnitMutation = useAddUnit();
  const updateUnitMutation = useUpdateUnit();
  const deleteUnitMutation = useDeleteUnit();

  const handleAddOrEdit = async (values: AddUnitPayload) => {
    try {
      if (editTarget) {
        await updateUnitMutation.mutateAsync({ id: editTarget._id, payload: values });
        toast.success("Unit updated successfully");
      } else {
        await addUnitMutation.mutateAsync(values);
        toast.success("Unit created successfully");
      }
      setEditTarget(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (unit: Unit) => {
    setEditTarget(unit);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteUnitMutation.mutateAsync(deleteId);
        toast.success("Unit deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete unit");
      }
    }
  };

  // Client-side search filtering
  const filtered = units.filter((u: Unit) => {
    const term = search.toLowerCase();
    const projName = typeof u.projectId === 'object' && u.projectId ? u.projectId.name : '';
    const towerName = typeof u.towerId === 'object' && u.towerId ? u.towerId.name : '';
    return (
      u.unitNumber.toLowerCase().includes(term) ||
      projName.toLowerCase().includes(term) ||
      towerName.toLowerCase().includes(term) ||
      (u.status || '').toLowerCase().includes(term)
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
          <h1 className="text-3xl font-bold tracking-tight">Units Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} units total</p>
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
            Add Unit
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
            placeholder="Search units by number or tower..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Project Select Filter */}
        <div className="w-[180px]">
          <Select
            value={projectIdFilter}
            onValueChange={(val) => {
              setProjectIdFilter(val || "all");
              setTowerIdFilter("all"); // Reset tower filter if project changes
              setCurrentPage(1);
            }}
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

        {/* Tower Select Filter */}
        <div className="w-[180px]">
          <Select
            value={towerIdFilter}
            onValueChange={(val) => { setTowerIdFilter(val || "all"); setCurrentPage(1); }}
            disabled={projectIdFilter === "all"}
          >
            <SelectTrigger className="w-full h-9 border-border bg-card">
              <SelectValue placeholder={projectIdFilter === "all" ? "Choose Project" : "All Towers"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Towers</SelectItem>
              {towers.map((tower) => (
                <SelectItem key={tower._id} value={tower._id}>
                  {tower.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table view */}
      <div className="w-full overflow-hidden">
        <UnitTable
          units={paginated}
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
              itemLabel="units"
            />
          </div>
        )}
      </div>

      {/* Drawer Form */}
      <UnitFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleAddOrEdit}
        unitToEdit={editTarget}
        isSubmitting={addUnitMutation.isPending || updateUnitMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteUnitMutation.isPending}
        title="Delete Unit"
        description="Are you sure you want to permanently delete this unit? This action cannot be undone."
      />
    </div>
  );
}
