import { Edit2, CreditCard, Trash2, MoreVertical, IndianRupee, Hash } from 'lucide-react';
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
import type { Payment } from '../types/payment.types';

interface PaymentTableProps {
  payments: Payment[];
  isLoading: boolean;
  onEdit: (payment: Payment) => void;
  onDelete: (id: string) => void;
  startIndex?: number;
}

export default function PaymentTable({
  payments,
  isLoading,
  onEdit,
  onDelete,
  startIndex = 0,
}: PaymentTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Refunded':
        return 'bg-blue-50 text-blue-700 border-blue-200';
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
              <TableHead>Payment Ref</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method/Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={9} />
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <CreditCard className="h-10 w-10 text-muted-foreground/30" />
                    <p className="font-medium text-muted-foreground">No payments found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment, index) => {
                const customerName = typeof payment.customerId === 'object' && payment.customerId
                  ? `${payment.customerId.firstName} ${payment.customerId.lastName}`
                  : '-';
                  
                const bookingRef = typeof payment.bookingId === 'object' && payment.bookingId ? payment.bookingId.bookingNumber : '-';
                
                return (
                  <TableRow key={payment._id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>
                      <span className="font-bold">{payment.paymentId || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{bookingRef}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">{customerName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(payment.paymentDate)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold flex items-center gap-0.5 text-indigo-600">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {payment.amount?.toLocaleString('en-IN') || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{payment.paymentMethod || '-'}</span>
                        {payment.paymentType && <span className="text-xs text-muted-foreground">{payment.paymentType}</span>}
                        {payment.transactionId && (
                           <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                             <Hash className="h-2.5 w-2.5" />
                             <span>{payment.transactionId}</span>
                           </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(payment.status || '')}`}>
                        {payment.status || 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted cursor-pointer transition-colors">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 rounded-lg">
                            <DropdownMenuItem onClick={() => onEdit(payment)} className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(payment._id)} className="cursor-pointer text-red-600 focus:text-red-600">
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
