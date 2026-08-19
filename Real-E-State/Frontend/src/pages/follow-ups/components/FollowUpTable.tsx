import { Edit2, PhoneCall, Trash2, MoreVertical, MessagesSquare, Calendar } from 'lucide-react';
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
import type { FollowUp } from '../types/followUp.types';

interface FollowUpTableProps {
  followUps: FollowUp[];
  isLoading: boolean;
  onEdit: (followUp: FollowUp) => void;
  onDelete: (id: string) => void;
  startIndex?: number;
}

export default function FollowUpTable({
  followUps,
  isLoading,
  onEdit,
  onDelete,
  startIndex = 0,
}: FollowUpTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Rescheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Missed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
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
              <TableHead>Type</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Next Follow-Up</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={7} />
            ) : followUps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <PhoneCall className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium text-muted-foreground">No follow-ups found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              followUps.map((fu, index) => {
                const clientName = fu.leadId
                  ? `${(fu.leadId as any).firstName} ${(fu.leadId as any).lastName}`
                  : fu.customerId
                  ? `${(fu.customerId as any).firstName} ${(fu.customerId as any).lastName}`
                  : '-';
                  
                const agentName = typeof fu.agentId === 'object' && fu.agentId 
                  ? `${fu.agentId.firstName} ${fu.agentId.lastName}`
                  : '-';

                return (
                  <TableRow key={fu._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         {fu.followUpType === 'Call' ? <PhoneCall className="h-4 w-4 text-indigo-500" /> : <MessagesSquare className="h-4 w-4 text-indigo-500" />}
                         <span className="font-medium">{fu.followUpType || 'Other'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">{clientName}</span>
                        {agentName !== '-' && <span className="text-xs text-muted-foreground">Assigned: {agentName}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">{formatDate(fu.date)}</span>
                        {fu.time && <span className="text-xs text-muted-foreground">{fu.time}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                         <Calendar className="h-3 w-3 text-muted-foreground" />
                         <span className="text-sm">{formatDate(fu.nextFollowUp)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(fu.status || '')}`}>
                        {fu.status || 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 rounded-lg">
                            <DropdownMenuItem onClick={() => onEdit(fu)} className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(fu._id)} className="cursor-pointer text-red-600 focus:text-red-600">
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
