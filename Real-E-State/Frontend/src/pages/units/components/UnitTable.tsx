import { Edit2, Building, Trash2, MoreVertical, IndianRupee } from 'lucide-react';
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
import type { Unit } from '../types/unit.types';

interface UnitTableProps {
  units: Unit[];
  isLoading: boolean;
  onEdit: (unit: Unit) => void;
  onDelete: (id: string) => void;
  startIndex?: number;
}

export default function UnitTable({
  units,
  isLoading,
  onEdit,
  onDelete,
  startIndex = 0,
}: UnitTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Hold':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Booked':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Sold':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Blocked':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Unit Number</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Tower</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Type/BHK</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={10} />
            ) : units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Building className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium text-muted-foreground">No units found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              units.map((unit, index) => {
                const projectName =
                  typeof unit.projectId === 'object' && unit.projectId
                    ? unit.projectId.name
                    : '-';
                const towerName = unit.tower || '-';

                return (
                  <TableRow key={unit._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell className="font-bold text-foreground">
                      {unit.unitNumber}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold">{projectName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{towerName}</span>
                    </TableCell>
                    <TableCell>{unit.floor ?? '-'}</TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{unit.unitType || '-'}{unit.bhk ? ` / ${unit.bhk}` : ''}</span>
                    </TableCell>
                    <TableCell>{unit.area ? `${unit.area}` : '-'}</TableCell>
                    <TableCell>
                      {unit.price ? (
                        <div className="flex items-center gap-0.5 text-indigo-600 font-semibold text-sm">
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span>{unit.price.toLocaleString('en-IN')}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(unit.status)}`}>
                        {unit.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 rounded-lg">
                            <DropdownMenuItem onClick={() => onEdit(unit)} className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(unit._id)} className="cursor-pointer text-red-600 focus:text-red-600">
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
