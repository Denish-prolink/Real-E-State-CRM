import { Edit2, Home, Trash2, Eye, MoreVertical } from 'lucide-react';
import { TruncatedName } from '@/components/common/TruncatedName';
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
import type { Warehouse } from '../types/warehouse.types';

interface WarehouseTableProps {
  warehouses: Warehouse[];
  isLoading: boolean;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (id: string) => void;
  onView: (warehouse: Warehouse) => void;
  startIndex?: number;
}

export default function WarehouseTable({ warehouses, isLoading, onEdit, onDelete, onView, startIndex = 0 }: WarehouseTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-25">WH Code</TableHead>
              <TableHead>Warehouse Info</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Contact (Mobile)</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={9} />
            ) : warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Home className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium text-muted-foreground">No warehouses found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              warehouses.map((warehouse, index) => (
                <TableRow key={warehouse._id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium text-xs">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md font-semibold">
                      {warehouse.warehouseCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <TruncatedName name={warehouse.warehouseName} maxLength={20} className="font-semibold text-sm" />
                      <span className="text-xs text-muted-foreground">{warehouse.city}, {warehouse.state}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border bg-muted/50">
                      {warehouse.warehouseType}
                    </span>
                  </TableCell>
                  <TableCell>
                    {warehouse.manager ? (
                      <TruncatedName name={`${warehouse.manager.firstName} ${warehouse.manager.lastName}`} maxLength={15} className="text-sm font-medium" />
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {warehouse.manager ? (
                        <>
                          <span className="text-sm font-medium text-foreground">{warehouse.manager.mobileNo}</span>
                          <span className="text-xs text-muted-foreground">{warehouse.manager.email}</span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{warehouse.capacity}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 rounded-lg">
                          <DropdownMenuItem onClick={() => onView(warehouse)} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(warehouse)} className="cursor-pointer">
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete(warehouse._id)} className="cursor-pointer text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
