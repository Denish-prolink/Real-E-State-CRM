import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import PaymentFormDrawer from "./components/PaymentFormDrawer";
import PaymentTable from "./components/PaymentTable";
import TablePagination from "@/components/common/TablePagination";
import {
  useGetPayments,
  useAddPayment,
  useUpdatePayment,
  useDeletePayment,
} from "./hooks/usePayments";
import type { AddPaymentPayload, Payment } from "./types/payment.types";

const PAGE_SIZE = 10;

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Payment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: payments = [], isLoading, isFetching } = useGetPayments();

  const addPaymentMutation = useAddPayment();
  const updatePaymentMutation = useUpdatePayment();
  const deletePaymentMutation = useDeletePayment();

  const handleAddOrEdit = async (values: AddPaymentPayload) => {
    try {
      if (editTarget) {
        await updatePaymentMutation.mutateAsync({ id: editTarget._id, payload: values });
        toast.success("Payment updated successfully");
      } else {
        await addPaymentMutation.mutateAsync(values);
        toast.success("Payment recorded successfully");
      }
      setEditTarget(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (payment: Payment) => {
    setEditTarget(payment);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deletePaymentMutation.mutateAsync(deleteId);
        toast.success("Payment deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete payment");
      }
    }
  };

  // Client-side search filtering
  const filtered = payments.filter((p: Payment) => {
    const term = search.toLowerCase();
    
    const customerName = typeof p.customerId === 'object' && p.customerId 
      ? `${p.customerId.firstName} ${p.customerId.lastName}`.toLowerCase() : '';
      
    const paymentNum = p.paymentId?.toLowerCase() || '';
    const bookingNum = typeof p.bookingId === 'object' && p.bookingId ? p.bookingId.bookingNumber.toLowerCase() : '';

    return (
      customerName.includes(term) ||
      paymentNum.includes(term) ||
      bookingNum.includes(term) ||
      (p.status || '').toLowerCase().includes(term)
    );
  });

  // Client-side pagination slicing
  const total = filtered.length;
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total payments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              setEditTarget(null);
              setDrawerOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by customer, booking or payment ID..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table view */}
      <div className="w-full overflow-hidden">
        <PaymentTable
          payments={paginated}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={setDeleteId}
          startIndex={startIndex}
        />

        {/* Pagination */}
        {!isLoading && total > PAGE_SIZE && (
          <div className="mt-4">
            <TablePagination
              currentPage={currentPage}
              totalItems={total}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="payments"
            />
          </div>
        )}
      </div>

      {/* Drawer Form */}
      <PaymentFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleAddOrEdit}
        paymentToEdit={editTarget}
        isSubmitting={addPaymentMutation.isPending || updatePaymentMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deletePaymentMutation.isPending}
        title="Delete Payment"
        description="Are you sure you want to permanently delete this payment? This action cannot be undone."
      />
    </div>
  );
}
