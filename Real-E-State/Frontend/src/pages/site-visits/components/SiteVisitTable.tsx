import { Edit2, MapPin, Trash2, MoreVertical, Calendar } from 'lucide-react';
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
import type { SiteVisit } from '../types/siteVisit.types';

interface SiteVisitTableProps {
  visits: SiteVisit[];
  isLoading: boolean;
  onEdit: (visit: SiteVisit) => void;
  onDelete: (id: string) => void;
  startIndex?: number;
}

export default function SiteVisitTable({
  visits,
  isLoading,
  onEdit,
  onDelete,
  startIndex = 0,
}: SiteVisitTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Confirmed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Rescheduled':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
      case 'No Show':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Property / Project</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={7} />
            ) : visits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Calendar className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium text-muted-foreground">No site visits found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              visits.map((visit, index) => {
                const clientName = visit.leadId
                  ? `${(visit.leadId as any).firstName} ${(visit.leadId as any).lastName}`
                  : visit.buyerId
                  ? `${(visit.buyerId as any).firstName} ${(visit.buyerId as any).lastName}`
                  : '-';
                  
                const propertyName = typeof visit.propertyId === 'object' && visit.propertyId ? visit.propertyId.propertyName : '-';
                const projectName = typeof visit.projectId === 'object' && visit.projectId ? visit.projectId.name : '-';
                
                const agentName = typeof visit.agentId === 'object' && visit.agentId 
                  ? `${visit.agentId.firstName} ${visit.agentId.lastName}`
                  : '-';

                return (
                  <TableRow key={visit._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">{formatDate(visit.visitDate)}</span>
                        {visit.visitTime && <span className="text-xs text-muted-foreground">{visit.visitTime}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{clientName}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {visit.propertyId && <span className="text-sm font-medium">{propertyName}</span>}
                        {visit.projectId && <span className="text-xs text-muted-foreground">{projectName}</span>}
                        {visit.location && (
                           <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                             <MapPin className="h-3 w-3" />
                             <span className="truncate max-w-[150px]">{visit.location}</span>
                           </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{agentName}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(visit.status)}`}>
                        {visit.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 rounded-lg">
                            <DropdownMenuItem onClick={() => onEdit(visit)} className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(visit._id)} className="cursor-pointer text-red-600 focus:text-red-600">
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
