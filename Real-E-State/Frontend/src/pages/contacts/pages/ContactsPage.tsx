import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import ContactFormDrawer from "../components/ContactFormDrawer";
import ContactGrid from "../components/ContactGrid";
import TablePagination from "@/components/common/TablePagination";
import { useAddContact } from "../hooks/useAddContact";
import { useDeleteContact } from "../hooks/useDeleteContact";
import { useGetContacts } from "../hooks/useGetContacts";
import { useUpdateContact } from "../hooks/useUpdateContact";
import type { AddContactPayload, Contact } from "../types/contact.types";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 12;

export default function ContactsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: apiResponse, isLoading, isFetching } = useGetContacts({
    page: currentPage,
    perPage: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const data = apiResponse as { contacts: Contact[]; total: number; page: number } | undefined;
  const contacts: Contact[] = data?.contacts || [];
  const total = data?.total || 0;
  const page = data?.page || 1;

  const addContactMutation = useAddContact();
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();

  const handleAddOrEdit = async (values: AddContactPayload) => {
    try {
      if (editTargetId) {
        await updateContactMutation.mutateAsync({ id: editTargetId._id, payload: values });
        toast.success("Contact updated successfully");
      } else {
        await addContactMutation.mutateAsync(values);
        toast.success("Contact created successfully");
      }
      setEditTargetId(null);
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const openEdit = (contact: Contact) => {
    setEditTargetId(contact);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteContactMutation.mutateAsync(deleteId);
        toast.success("Contact deleted successfully");
        setDeleteId(null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete contact");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} total contacts</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => {
              setEditTargetId(null);
              setDrawerOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name, email or phone..."
            className="w-full h-9 rounded-lg border border-border pl-9 pr-4 text-sm bg-muted/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="w-full overflow-hidden">
        <ContactGrid
          contacts={contacts}
          isLoading={isLoading || isFetching}
          onEdit={openEdit}
          onDelete={setDeleteId}
          onView={(contact) => navigate(`/contacts/${contact._id}`)}
        />

        {/* Server-side Pagination */}
        {!(isLoading || isFetching) && (
          <div className="mt-4">
            <TablePagination
              currentPage={page}
              totalItems={total}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemLabel="contacts"
            />
          </div>
        )}
      </div>

      {/* Drawer */}
      <ContactFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditTargetId(null);
        }}
        onSubmit={handleAddOrEdit}
        contactToEdit={editTargetId}
        isSubmitting={addContactMutation.isPending || updateContactMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(val) => !val && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteContactMutation.isPending}
        title="Delete Contact"
        description="Are you sure you want to permanently delete this contact? This action cannot be undone."
      />
    </div>
  );
}
