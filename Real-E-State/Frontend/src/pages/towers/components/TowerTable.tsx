import { Link } from 'react-router-dom';
import { Edit2, Building, Trash2, MoreVertical, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableSkeleton } from '@/components/ui/table-skeleton';
import type { Tower } from '../types/tower.types';

interface TowerTableProps {
  towers: Tower[];
  isLoading: boolean;
  onEdit: (tower: Tower) => void;
  onDelete: (id: string) => void;
  startIndex?: number;
}

export default function TowerTable({
  towers,
  isLoading,
  onEdit,
  onDelete,
  startIndex = 0,
}: TowerTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Tower Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Total Floors</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={6} />
            ) : towers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Building className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium text-muted-foreground">No towers found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              towers.map((tower, index) => {
                const projectName =
                  typeof tower.projectId === 'object' && tower.projectId
                    ? tower.projectId.name
                    : 'Unknown Project';

                return (
                  <TableRow key={tower._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell className="font-semibold text-foreground">
                      <Link to={`/towers/${tower._id}`} className="hover:underline">
                        {tower.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 rounded-md font-semibold text-xs border border-indigo-100 dark:border-indigo-900">
                        {projectName}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {tower.floors || 0}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {tower.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 rounded-lg">
                            <DropdownMenuItem className="cursor-pointer p-0">
                              <Link to={`/towers/${tower._id}`} className="flex items-center w-full px-2 py-1.5">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(tower)} className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(tower._id)} className="cursor-pointer text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
