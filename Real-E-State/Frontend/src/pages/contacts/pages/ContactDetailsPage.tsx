import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building, Edit, Mail, MoreHorizontal, Phone, Store, Trash2, User, Calendar, MapPin, FileText, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetContactById } from "../hooks/useGetContactById";
import { useUpdateContact } from "../hooks/useUpdateContact";
import { useDeleteContact } from "../hooks/useDeleteContact";
import ContactFormDrawer from "../components/ContactFormDrawer";
import type { AddContactPayload } from "../types/contact.types";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

export default function ContactDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: contact, isLoading, error, refetch } = useGetContactById(id || "", {
    enabled: !!id,
  });

  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-muted-foreground text-sm">Loading contact details...</p>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="flex flex-col gap-4 p-6 min-h-full items-center justify-center">
        <p className="text-red-500 font-medium">Failed to load contact or contact not found.</p>
        <Button onClick={() => navigate("/contacts")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Contacts
        </Button>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "customer":
        return <User className="h-5 w-5" />;
      case "supplier":
        return <Building className="h-5 w-5" />;
      case "vendor":
        return <Store className="h-5 w-5" />;
      case "seller":
        return <Store className="h-5 w-5" />;
      default:
        return <MoreHorizontal className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "supplier":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "vendor":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "seller":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  const handleEditSubmit = async (values: AddContactPayload) => {
    try {
      await updateContactMutation.mutateAsync({ id: contact._id, payload: values });
      toast.success("Contact updated successfully");
      setDrawerOpen(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update contact");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContactMutation.mutateAsync(contact._id);
      toast.success("Contact deleted successfully");
      setShowDeleteConfirm(false);
      navigate("/contacts");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete contact");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-full max-w-4xl mx-auto">
      {/* Back button and Action Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate("/contacts")}
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Contacts
        </Button>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted cursor-pointer">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-lg">
              <DropdownMenuItem onClick={() => setDrawerOpen(true)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteConfirm(true)} className="cursor-pointer text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center border-2 shadow-md font-bold text-xl shrink-0 ${getTypeColor(contact.type)}`}>
          {getInitials(contact.name)}
        </div>
        <div className="text-center sm:text-left flex-1 min-w-0">
  <div className="flex items-center justify-between gap-4">
    <h1 className="text-xl font-bold tracking-tight text-foreground truncate">
      {contact.name}
    </h1>

    <span
      className={`shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs tracking-wider uppercase border ${getTypeColor(contact.type)}`}
    >
      {getTypeIcon(contact.type)}
      <span className="ml-1.5">{contact.type}</span>
    </span>
  </div>
</div>
      </div>

      {/* Details Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact info card */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Contact Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Mobile Number</p>
                <p className="font-semibold text-foreground mt-0.5 text-sm">{contact.mobileNo}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="font-semibold text-foreground mt-0.5 text-sm  ">{contact.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Profile Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="font-semibold text-foreground capitalize mt-0.5 text-sm">{contact.gender || "Not specified"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <p className="font-semibold text-foreground text-sm">
                  {contact.dob
                    ? new Date(contact.dob).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-500" /> Address
          </h3>
          <p className="text-foreground leading-relaxed text-sm">
            {contact.address || "No address details specified."}
          </p>
        </div>

        {/* Notes Card */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-500" /> Notes and Comments
          </h3>
          <div className="text-sm bg-muted/20 rounded-lg p-4 border border-border min-h-24">
            <p className="text-foreground italic leading-relaxed whitespace-pre-wrap">
              {contact.notes || "No notes available for this contact."}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form Drawer */}
      <ContactFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleEditSubmit}
        contactToEdit={contact}
        isSubmitting={updateContactMutation.isPending}
      />

      {/* Delete Confirmation Alert Dialog */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(val) => !val && !deleteContactMutation.isPending && setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isPending={deleteContactMutation.isPending}
        title="Delete Contact"
        itemName={contact.name}
      />
    </div>
  );
}
