import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, MoreVertical, MapPin, Calendar, FolderOpen, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetProjectById, useUpdateProject, useDeleteProject } from "../hooks/useProjects";
import ProjectFormDrawer from "../components/ProjectFormDrawer";
import type { AddProjectPayload } from "../types/project.types";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

export default function ViewProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: project, isLoading, error, refetch } = useGetProjectById(id || "");
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-muted-foreground text-sm">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-full items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load project or project not found.</p>
        <Button onClick={() => navigate("/projects")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200';
      case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200';
      case 'Completed': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200';
      case 'On Hold': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEditSubmit = async (values: AddProjectPayload) => {
    try {
      await updateProjectMutation.mutateAsync({ id: project._id, payload: values });
      toast.success("Project updated successfully");
      setDrawerOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update project");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project._id);
      toast.success("Project deleted successfully");
      setShowDeleteConfirm(false);
      navigate("/projects");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full max-w-5xl mx-auto">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/projects")}
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Projects
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
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${getStatusColor(project.status || '')}`}>
              {project.status || 'Planned'}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
              Project
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FolderOpen className="h-7 w-7 text-indigo-500" />
            {project.name}
          </h1>
          {project.address && (
            <div className="flex items-center gap-1.5 text-muted-foreground mt-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{project.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specs & Features */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Project Schedule
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Calendar className="h-4 w-4 text-indigo-500" /> Start Date
              </div>
              <p className="font-medium text-foreground">
                {project.startDate ? formatDate(project.startDate) : 'Not Specified'}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Calendar className="h-4 w-4 text-indigo-500" /> End Date
              </div>
              <p className="font-medium text-foreground">
                {project.endDate ? formatDate(project.endDate) : 'Not Specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            About This Project
          </h3>
          {project.description ? (
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {project.description}
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
      <ProjectFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleEditSubmit}
        projectToEdit={project}
        isSubmitting={updateProjectMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        isPending={deleteProjectMutation.isPending}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </div>
  );
}
