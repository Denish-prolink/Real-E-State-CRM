import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import ProjectFormDrawer from "../components/ProjectFormDrawer";
import ProjectGrid from "../components/ProjectGrid";
import TablePagination from "@/components/common/TablePagination";
import {
  useGetProjects,
  useAddProject,
  useUpdateProject,
  useDeleteProject,
} from "../hooks/useProjects";
import type { AddProjectPayload, Project } from "../types/project.types";

const PAGE_SIZE = 9;

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: projects = [], isLoading, isFetching } = useGetProjects({
    search: search || undefined
  });

  const addProjectMutation = useAddProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const handleAddOrEdit = async (values: AddProjectPayload) => {
    try {
      if (editTarget) {
        await updateProjectMutation.mutateAsync({ id: editTarget._id, payload: values });
        toast.success("Project updated successfully");
      } else {
        await addProjectMutation.mutateAsync(values);
        toast.success("Project created successfully");
      }
      setEditTarget(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (project: Project) => {
    setEditTarget(project);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteProjectMutation.mutateAsync(deleteId);
        toast.success("Project deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete project");
      }
    }
  };

  // Client-side pagination slicing
  const total = projects.length;
  const paginated = projects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} projects total</p>
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
            Add Project
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
            placeholder="Search projects..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid view */}
      <div className="w-full overflow-hidden">
        <ProjectGrid
          projects={paginated}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={setDeleteId}
        />

        {/* Pagination */}
        {!isLoading && total > PAGE_SIZE && (
          <div className="mt-6">
            <TablePagination
              currentPage={currentPage}
              totalItems={total}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="projects"
            />
          </div>
        )}
      </div>

      {/* Drawer Form */}
      <ProjectFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleAddOrEdit}
        projectToEdit={editTarget}
        isSubmitting={addProjectMutation.isPending || updateProjectMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteProjectMutation.isPending}
        title="Delete Project"
        description="Are you sure you want to permanently delete this project? This action cannot be undone."
      />
    </div>
  );
}
