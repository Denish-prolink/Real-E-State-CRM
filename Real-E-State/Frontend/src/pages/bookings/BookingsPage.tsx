import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import BookingFormDrawer from "./components/BookingFormDrawer";
import BookingTable from "./components/BookingTable";
import TablePagination from "@/components/common/TablePagination";
import {
  useGetBookings,
  useAddBooking,
  useUpdateBooking,
  useDeleteBooking,
} from "./hooks/useBookings";
import type { AddBookingPayload, Booking } from "./types/booking.types";

const PAGE_SIZE = 10;

export default function BookingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Booking | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: bookings = [], isLoading, isFetching } = useGetBookings();

  const addBookingMutation = useAddBooking();
  const updateBookingMutation = useUpdateBooking();
  const deleteBookingMutation = useDeleteBooking();

  const handleAddOrEdit = async (values: AddBookingPayload) => {
    try {
      if (editTarget) {
        await updateBookingMutation.mutateAsync({ id: editTarget._id, payload: values });
        toast.success("Booking updated successfully");
      } else {
        await addBookingMutation.mutateAsync(values);
        toast.success("Booking created successfully");
      }
      setEditTarget(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (booking: Booking) => {
    setEditTarget(booking);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteBookingMutation.mutateAsync(deleteId);
        toast.success("Booking deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete booking");
      }
    }
  };

  // Client-side search filtering
  const filtered = bookings.filter((b: Booking) => {
    const term = search.toLowerCase();
    
    const customerName = typeof b.customerId === 'object' && b.customerId 
      ? `${b.customerId.firstName} ${b.customerId.lastName}`.toLowerCase() : '';
      
    const propName = typeof b.propertyId === 'object' && b.propertyId ? b.propertyId.propertyName.toLowerCase() : '';
    const projName = typeof b.projectId === 'object' && b.projectId ? b.projectId.name.toLowerCase() : '';
    const bookingNum = b.bookingNumber?.toLowerCase() || '';

    return (
      customerName.includes(term) ||
      propName.includes(term) ||
      projName.includes(term) ||
      bookingNum.includes(term) ||
      (b.bookingStatus || '').toLowerCase().includes(term) ||
      (b.paymentStatus || '').toLowerCase().includes(term)
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
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total bookings</p>
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
            Create Booking
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
            placeholder="Search by customer, property or booking number..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table view */}
      <div className="w-full overflow-hidden">
        <BookingTable
          bookings={paginated}
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
              itemLabel="bookings"
            />
          </div>
        )}
      </div>

      {/* Drawer Form */}
      <BookingFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleAddOrEdit}
        bookingToEdit={editTarget}
        isSubmitting={addBookingMutation.isPending || updateBookingMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteBookingMutation.isPending}
        title="Delete Booking"
        description="Are you sure you want to permanently delete this booking? This action cannot be undone."
      />
    </div>
  );
}
