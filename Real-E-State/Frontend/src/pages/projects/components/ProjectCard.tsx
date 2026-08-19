import { Edit2, Trash2, MoreVertical, MapPin, Building2, FolderOpen, IndianRupee } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TruncatedName } from '@/components/common/TruncatedName';
import type { Project } from '../types/project.types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planned':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Completed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'On Hold':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow group p-5 gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
            <Building2 className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <TruncatedName name={project.name} maxLength={22} className="font-bold text-foreground text-lg" />
            <div className="mt-1 flex gap-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              {project.projectType && (
                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase border bg-gray-50 text-gray-700 border-gray-200">
                   {project.projectType}
                 </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-lg">
              <DropdownMenuItem onClick={() => onEdit(project)} className="cursor-pointer">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(project._id)} className="cursor-pointer text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {project.description}
        </p>
      )}

      <div className="flex flex-col gap-2 mt-2 border-t border-border/50 pt-3">
        {project.startingPrice && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IndianRupee className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="truncate font-semibold text-indigo-600">Starts at ₹{project.startingPrice.toLocaleString('en-IN')}</span>
          </div>
        )}
        {(project.totalUnits !== undefined || project.availableUnits !== undefined) && (
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <FolderOpen className="h-4 w-4 text-indigo-500 shrink-0" />
             <span className="truncate">
               {project.availableUnits ?? 0} available / {project.totalUnits ?? 0} total units
             </span>
           </div>
        )}
        {project.address && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{project.address}</span>
          </div>
        )}
      </div>
    </div>
  );
}
