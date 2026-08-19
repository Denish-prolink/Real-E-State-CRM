import { Edit2, BookOpenCheck, Trash2, MoreVertical, IndianRupee } from 'lucide-react';
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
import type { Booking } from '../types/booking.types';

interface BookingTableProps {
  bookings: Booking[];
  isLoading: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
  startIndex?: number;
}

export default function BookingTable({
  bookings,
  isLoading,
  onEdit,
  onDelete,
  startIndex = 0,
}: BookingTableProps) {
  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Confirmed':
      case 'Completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Partial':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Failed':
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
              <TableHead>Booking Ref</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Property / Unit</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={9} />
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <BookOpenCheck className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium text-muted-foreground">No bookings found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking, index) => {
                const customerName = typeof booking.customerId === 'object' && booking.customerId
                  ? `${booking.customerId.firstName} ${booking.customerId.lastName}`
                  : '-';
                  
                const propertyName = typeof booking.propertyId === 'object' && booking.propertyId ? booking.propertyId.propertyName : '-';
                const projectName = typeof booking.projectId === 'object' && booking.projectId ? booking.projectId.name : '';
                const unitName = typeof booking.unitId === 'object' && booking.unitId ? booking.unitId.unitNumber : '';
                
                return (
                  <TableRow key={booking._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>
                      <span className="font-bold">{booking.bookingNumber || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">{customerName}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{propertyName} {projectName ? `(${projectName})` : ''}</span>
                        {unitName && <span className="text-xs text-muted-foreground">Unit: {unitName}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(booking.bookingDate)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold flex items-center gap-0.5 text-indigo-600">
                          <IndianRupee className="h-3 w-3" />
                          {booking.finalAmount?.toLocaleString('en-IN') || booking.totalAmount?.toLocaleString('en-IN') || '-'}
                        </span>
                        {booking.bookingAmount ? (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            Booked at <IndianRupee className="h-2 w-2" />{booking.bookingAmount.toLocaleString('en-IN')}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPaymentStatusColor(booking.paymentStatus || '')}`}>
                        {booking.paymentStatus || 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBookingStatusColor(booking.bookingStatus || '')}`}>
                        {booking.bookingStatus || 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 rounded-lg">
                            <DropdownMenuItem onClick={() => onEdit(booking)} className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(booking._id)} className="cursor-pointer text-red-600 focus:text-red-600">
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
