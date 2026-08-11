import { Edit2, Trash2, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { TruncatedName } from '@/components/common/TruncatedName';
import type { Employee } from '../types/employee.types';
import { TableSkeleton } from '@/components/ui/table-skeleton';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  startIndex?: number;
}

export default function EmployeeTable({ employees, isLoading, onEdit, onDelete, startIndex = 0 }: EmployeeTableProps) {
  return (
    <div className={ employees.length > 0 ? "rounded-xl border border-border bg-card overflow-hidden shadow-sm" : " overflow-hidden shadow-sm"}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-25">Emp Code</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Contact </TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={8} />
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Users className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium text-muted-foreground">No employees found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee, index) => (
                <TableRow key={employee._id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell className="font-medium text-xs">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md font-semibold">
                      {employee.employeeCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {employee.firstName.charAt(0).toUpperCase()}{employee.lastName.charAt(0).toUpperCase()}
                      </div> */}
                      <div className="flex flex-col">
                        <TruncatedName name={`${employee.firstName} ${employee.lastName}`} maxLength={18} className="font-semibold text-sm" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span>{employee.mobileNo}</span>
                      {/* <span>{employee.email}</span> */}
                      {/* {employee.address && <span className="truncate max-w-[180px] italic mt-0.5" title={employee.address}>{employee.address}</span>} */}
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border bg-muted/50">
                      {employee.designation}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(employee.joiningDate).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(employee)}
                        className="p-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-md transition-colors"
                        title="Edit Employee"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(employee._id)}
                        className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition-colors"
                        title="Delete Employee"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
