import type { Project } from '../types/project.types';
import ProjectCard from './ProjectCard';
import { FolderOpen } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectGrid({ projects, isLoading, onEdit, onDelete }: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border shadow-sm p-5 h-48 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-lg shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
            <div className="h-4 bg-muted rounded w-full mt-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card border border-border rounded-xl border-dashed">
        <FolderOpen className="h-10 w-10 text-muted-foreground/50 animate-bounce" />
        <p className="font-medium text-lg mt-2">No projects found</p>
        <p className="text-muted-foreground mt-1 text-sm">Add residential or commercial projects to organize your real estate catalog.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
